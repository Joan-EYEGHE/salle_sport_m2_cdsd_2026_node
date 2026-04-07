import { AccessLogData } from "../data/accesslog.data";
import { ResultatScan } from "../models/accesslog.model";

type LogFilters = {
    resultat?: string;
    date_debut?: string;
    date_fin?: string;
};

export const AccessLogService = {
    async list(filters: LogFilters = {}) {
        const resultat = filters.resultat as ResultatScan | undefined;
        if (resultat && resultat !== 'SUCCES' && resultat !== 'ECHEC') {
            throw Object.assign(new Error('resultat doit être SUCCES ou ECHEC'), { status: 400 });
        }
        return AccessLogData.findAll({ resultat, date_debut: filters.date_debut, date_fin: filters.date_fin });
    },

    async stats(filters: LogFilters = {}) {
        const rows = await AccessLogData.findAll({
            resultat: filters.resultat as ResultatScan | undefined,
            date_debut: filters.date_debut,
            date_fin: filters.date_fin,
        });
        const total_scans = rows.length;
        const total_succes = rows.filter(r => r.resultat === 'SUCCES').length;
        const total_echec = rows.filter(r => r.resultat === 'ECHEC').length;
        const taux_succes = total_scans > 0 ? parseFloat(((total_succes / total_scans) * 100).toFixed(2)) : 0;
        return { total_scans, total_succes, total_echec, taux_succes };
    },

    async listForExport(filters: LogFilters = {}) {
        return AccessLogData.findAll({
            resultat: filters.resultat as ResultatScan | undefined,
            date_debut: filters.date_debut,
            date_fin: filters.date_fin,
        });
    },
};

export function toCSV(rows: Awaited<ReturnType<typeof AccessLogData.findAll>>): string {
    const escape = (v: any) => `"${String(v ?? '').replace(/"/g, '""')}"`;
    const headers = ['id', 'id_ticket', 'date_scan', 'resultat', 'id_controller'];
    const lines = rows.map(r =>
        [r.id, r.id_ticket ?? '', r.date_scan?.toISOString() ?? '', r.resultat, r.id_controller]
            .map(escape).join(',')
    );
    return [headers.join(','), ...lines].join('\n');
}
