"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccessLogService = void 0;
exports.toCSV = toCSV;
const accesslog_data_1 = require("../data/accesslog.data");
function parseListQuery(q) {
    const resultat = typeof q.resultat === 'string' ? q.resultat : undefined;
    const date_debut = typeof q.date_debut === 'string' ? q.date_debut : undefined;
    const date_fin = typeof q.date_fin === 'string' ? q.date_fin : undefined;
    const period = typeof q.period === 'string' ? q.period : undefined;
    const memberIdRaw = q.memberId != null ? Number(q.memberId) : undefined;
    const memberId = Number.isFinite(memberIdRaw) ? memberIdRaw : undefined;
    const limitRaw = q.limit != null ? Number(q.limit) : undefined;
    const limit = Number.isFinite(limitRaw) ? limitRaw : undefined;
    const sortRaw = typeof q.sort === 'string' ? q.sort : undefined;
    const sort = sortRaw === 'asc' || sortRaw === 'desc' ? sortRaw : undefined;
    return { resultat, date_debut, date_fin, period, memberId, limit, sort };
}
exports.AccessLogService = {
    async list(q = {}) {
        const { resultat, date_debut, date_fin, period, memberId, limit, sort } = parseListQuery(q);
        const r = resultat;
        if (r && r !== 'SUCCES' && r !== 'ECHEC') {
            throw Object.assign(new Error('resultat doit être SUCCES ou ECHEC'), { status: 400 });
        }
        return accesslog_data_1.AccessLogData.findAll({
            resultat: r,
            date_debut,
            date_fin,
            period,
            memberId,
            limit,
            sort,
        });
    },
    async stats(q = {}) {
        const { resultat, date_debut, date_fin, period, memberId } = parseListQuery(q);
        const r = resultat;
        const rows = await accesslog_data_1.AccessLogData.findAll({
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
    async listForExport(q = {}) {
        const { resultat, date_debut, date_fin, period, memberId } = parseListQuery(q);
        const r = resultat;
        return accesslog_data_1.AccessLogData.findAll({
            resultat: r,
            date_debut,
            date_fin,
            period,
            memberId,
        });
    },
};
function toCSV(rows) {
    const escape = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
    const headers = ['id', 'id_ticket', 'id_membre', 'date_scan', 'resultat', 'id_controller'];
    const lines = rows.map(r => [r.id, r.id_ticket ?? '', r.id_membre ?? '', r.date_scan?.toISOString() ?? '', r.resultat, r.id_controller]
        .map(escape).join(','));
    return [headers.join(','), ...lines].join('\n');
}
