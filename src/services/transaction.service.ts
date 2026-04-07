import { TransactionData } from "../data/transaction.data";
import { TypeTransaction } from "../models/transaction.model";

type ListFilters = {
    type?: string;
    date_debut?: string;
    date_fin?: string;
};

type CreateManualInput = {
    montant: number;
    type: TypeTransaction;
    libelle: string;
    id_membre?: number;
    date?: string;
};

export const TransactionService = {
    async list(filters: ListFilters = {}) {
        const type = filters.type as TypeTransaction | undefined;
        if (type && type !== 'REVENU' && type !== 'DEPENSE') {
            throw Object.assign(new Error('type doit être REVENU ou DEPENSE'), { status: 400 });
        }
        return TransactionData.findAll({ type, date_debut: filters.date_debut, date_fin: filters.date_fin });
    },

    async createManual(input: CreateManualInput) {
        if (!input.montant || isNaN(Number(input.montant))) {
            throw Object.assign(new Error('montant est requis'), { status: 400 });
        }
        if (!input.type || !['REVENU', 'DEPENSE'].includes(input.type)) {
            throw Object.assign(new Error('type doit être REVENU ou DEPENSE'), { status: 400 });
        }
        if (!input.libelle?.trim()) {
            throw Object.assign(new Error('libelle est requis'), { status: 400 });
        }
        return TransactionData.create({
            montant: Number(input.montant),
            type: input.type,
            libelle: input.libelle.trim(),
            id_membre: input.id_membre ?? null,
            date: input.date ? new Date(input.date) : new Date(),
        });
    },

    async summary(filters: ListFilters = {}) {
        const type = filters.type as TypeTransaction | undefined;
        const rows = await TransactionData.findAll({
            type,
            date_debut: filters.date_debut,
            date_fin: filters.date_fin,
        });

        let total_revenus = 0;
        let total_depenses = 0;

        for (const row of rows) {
            const montant = parseFloat(row.montant as any) || 0;
            if (row.type === 'REVENU') total_revenus += montant;
            else total_depenses += montant;
        }

        return {
            total_revenus: parseFloat(total_revenus.toFixed(2)),
            total_depenses: parseFloat(total_depenses.toFixed(2)),
            solde: parseFloat((total_revenus - total_depenses).toFixed(2)),
            nb_transactions: rows.length,
        };
    },

    async listForExport(filters: ListFilters = {}) {
        const type = filters.type as TypeTransaction | undefined;
        return TransactionData.findAll({
            type,
            date_debut: filters.date_debut,
            date_fin: filters.date_fin,
        });
    },
};

export function toCSV(rows: Awaited<ReturnType<typeof TransactionService.listForExport>>): string {
    const escape = (v: any) => `"${String(v ?? '').replace(/"/g, '""')}"`;
    const headers = ['id', 'type', 'montant', 'libelle', 'date', 'id_membre'];
    const lines = rows.map(r =>
        [r.id, r.type, r.montant, r.libelle, r.date?.toISOString() ?? '', r.id_membre ?? '']
            .map(escape).join(',')
    );
    return [headers.join(','), ...lines].join('\n');
}
