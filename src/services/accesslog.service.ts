import { AccessLogData } from "../data/accesslog.data";
import { ResultatScan } from "../models/accesslog.model";

function parseListQuery(q: Record<string, unknown>) {
    const resultat = typeof q.resultat === 'string' ? q.resultat : undefined;
    const date_debut = typeof q.date_debut === 'string' ? q.date_debut : undefined;
    const date_fin = typeof q.date_fin === 'string' ? q.date_fin : undefined;
    const period = typeof q.period === 'string' ? q.period : undefined;
    const memberIdRaw = q.memberId != null ? Number(q.memberId) : undefined;
    const memberId = Number.isFinite(memberIdRaw) ? memberIdRaw : undefined;
    const limitRaw = q.limit != null ? Number(q.limit) : undefined;
    const limit = Number.isFinite(limitRaw) ? limitRaw : undefined;
    const sortRaw = typeof q.sort === 'string' ? q.sort : undefined;
    const sort: 'asc' | 'desc' | undefined =
        sortRaw === 'asc' || sortRaw === 'desc' ? sortRaw : undefined;
    return { resultat, date_debut, date_fin, period, memberId, limit, sort };
}

export const AccessLogService = {
    async list(q: Record<string, unknown> = {}) {
        const { resultat, date_debut, date_fin, period, memberId, limit, sort } = parseListQuery(q);
        const r = resultat as ResultatScan | undefined;
        if (r && r !== 'SUCCES' && r !== 'ECHEC') {
            throw Object.assign(new Error('resultat doit être SUCCES ou ECHEC'), { status: 400 });
        }
        return AccessLogData.findAll({
            resultat: r,
            date_debut,
            date_fin,
            period,
            memberId,
            limit,
            sort,
        });
    },

    async stats(q: Record<string, unknown> = {}) {
        const { resultat, date_debut, date_fin, period, memberId } = parseListQuery(q);
        const r = resultat as ResultatScan | undefined;
        const rows = await AccessLogData.findAll({
            resultat: r,
            date_debut,
            date_fin,
            period,
            memberId,
        });
        const total_scans = rows.length;
        const total_succes = rows.filter(row => row.resultat === 'SUCCES').length;
        const total_echec = rows.filter(row => row.resultat === 'ECHEC').length;
        const taux_succes = total_scans > 0 ? parseFloat(((total_succes / total_scans) * 100).toFixed(2)) : 0;
        return { total_scans, total_succes, total_echec, taux_succes };
    },

    async listForExport(q: Record<string, unknown> = {}) {
        const { resultat, date_debut, date_fin, period, memberId } = parseListQuery(q);
        const r = resultat as ResultatScan | undefined;
        return AccessLogData.findAll({
            resultat: r,
            date_debut,
            date_fin,
            period,
            memberId,
        });
    },
};

export function toCSV(rows: Awaited<ReturnType<typeof AccessLogData.findAll>>): string {
    const escape = (v: any) => `"${String(v ?? '').replace(/"/g, '""')}"`;
    const headers = ['id', 'id_ticket', 'id_membre', 'date_scan', 'resultat', 'id_controller'];
    const lines = rows.map(r =>
        [r.id, r.id_ticket ?? '', r.id_membre ?? '', r.date_scan?.toISOString() ?? '', r.resultat, r.id_controller]
            .map(escape).join(',')
    );
    return [headers.join(','), ...lines].join('\n');
}
