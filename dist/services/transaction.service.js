"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionService = void 0;
exports.toCSV = toCSV;
const transaction_data_1 = require("../data/transaction.data");
exports.TransactionService = {
    async list(filters = {}) {
        const type = filters.type;
        if (type && type !== 'REVENU' && type !== 'DEPENSE') {
            throw Object.assign(new Error('type doit être REVENU ou DEPENSE'), { status: 400 });
        }
        const mid = filters.memberId != null ? Number(filters.memberId) : undefined;
        const memberId = Number.isFinite(mid) ? mid : undefined;
        return transaction_data_1.TransactionData.findAll({
            type,
            date_debut: filters.date_debut,
            date_fin: filters.date_fin,
            memberId,
        });
    },
    async createManual(input) {
        if (!input.montant || isNaN(Number(input.montant))) {
            throw Object.assign(new Error('montant est requis'), { status: 400 });
        }
        if (!input.type || !['REVENU', 'DEPENSE'].includes(input.type)) {
            throw Object.assign(new Error('type doit être REVENU ou DEPENSE'), { status: 400 });
        }
        if (!input.libelle?.trim()) {
            throw Object.assign(new Error('libelle est requis'), { status: 400 });
        }
        const mp = input.methode_paiement;
        if (mp != null && mp !== 'CASH' && mp !== 'WAVE' && mp !== 'ORANGE') {
            throw Object.assign(new Error('methode_paiement invalide'), { status: 400 });
        }
        return transaction_data_1.TransactionData.create({
            montant: Number(input.montant),
            type: input.type,
            libelle: input.libelle.trim(),
            id_membre: input.id_membre ?? null,
            date: input.date ? new Date(input.date) : new Date(),
            methode_paiement: mp ?? 'CASH',
        });
    },
    async summary(filters = {}) {
        const type = filters.type;
        const mid = filters.memberId != null ? Number(filters.memberId) : undefined;
        const memberId = Number.isFinite(mid) ? mid : undefined;
        const rows = await transaction_data_1.TransactionData.findAll({
            type,
            date_debut: filters.date_debut,
            date_fin: filters.date_fin,
            memberId,
        });
        let total_revenus = 0;
        let total_depenses = 0;
        for (const row of rows) {
            const montant = parseFloat(row.montant) || 0;
            if (row.type === 'REVENU')
                total_revenus += montant;
            else
                total_depenses += montant;
        }
        return {
            total_revenus: parseFloat(total_revenus.toFixed(2)),
            total_depenses: parseFloat(total_depenses.toFixed(2)),
            solde: parseFloat((total_revenus - total_depenses).toFixed(2)),
            nb_transactions: rows.length,
        };
    },
    async listForExport(filters = {}) {
        const type = filters.type;
        const mid = filters.memberId != null ? Number(filters.memberId) : undefined;
        const memberId = Number.isFinite(mid) ? mid : undefined;
        return transaction_data_1.TransactionData.findAll({
            type,
            date_debut: filters.date_debut,
            date_fin: filters.date_fin,
            memberId,
        });
    },
};
function toCSV(rows) {
    const escape = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
    const headers = ['id', 'type', 'montant', 'libelle', 'date', 'id_membre'];
    const lines = rows.map(r => [r.id, r.type, r.montant, r.libelle, r.date?.toISOString() ?? '', r.id_membre ?? '']
        .map(escape).join(','));
    return [headers.join(','), ...lines].join('\n');
}
