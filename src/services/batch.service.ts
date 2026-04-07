import { v4 as uuidv4 } from 'uuid';
import { Activity, Batch, sequelize, Ticket } from "../models";
import { BatchData } from "../data/batch.data";
import { TicketStatus } from '../models/ticket.model';

function buildDatePrefix(d: Date): string {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `T${y}${m}${day}`;
}

function computeStatusCounts(tickets: Ticket[]): Record<TicketStatus, number> {
    const counts: Record<TicketStatus, number> = { DISPONIBLE: 0, VENDU: 0, UTILISE: 0, EXPIRE: 0 };
    for (const t of tickets) {
        if (t.status && counts[t.status] !== undefined) counts[t.status]++;
    }
    return counts;
}

export const BatchService = {
    async list() {
        const batches = await BatchData.findAll();
        return batches.map(b => {
            const json = b.toJSON() as any;
            const tickets: Ticket[] = json.Tickets ?? [];
            return { ...json, ticket_counts: computeStatusCounts(tickets) };
        });
    },

    async getById(id: number) {
        const batch = await BatchData.findByPk(id);
        if (!batch) throw Object.assign(new Error('Batch not found'), { status: 404 });
        const json = batch.toJSON() as any;
        const tickets: Ticket[] = json.Tickets ?? [];
        return { ...json, ticket_counts: computeStatusCounts(tickets) };
    },

    async generate(input: { id_activity: number; quantite: number; prix_unitaire_applique?: number }) {
        if (!input.id_activity) throw Object.assign(new Error('id_activity est requis'), { status: 400 });
        if (!input.quantite || input.quantite <= 0) throw Object.assign(new Error('quantite doit être > 0'), { status: 400 });

        const result = await sequelize.transaction(async (t) => {
            const activity = await Activity.findByPk(input.id_activity, { transaction: t });
            if (!activity) throw Object.assign(new Error('Activité introuvable'), { status: 404 });
            if (!activity.status) throw Object.assign(new Error('Activité inactive'), { status: 400 });

            const prix_unitaire = input.prix_unitaire_applique != null
                ? Number(input.prix_unitaire_applique)
                : parseFloat(activity.prix_ticket as any) || 0;

            const batch = await Batch.create({
                id_activity: input.id_activity,
                quantite: input.quantite,
                prix_unitaire_applique: prix_unitaire,
            }, { transaction: t });

            const date_expiration = new Date(Date.now() + 24 * 60 * 60 * 1000);
            const prefix = buildDatePrefix(new Date());

            for (let i = 0; i < input.quantite; i++) {
                const code_ticket = `${prefix}-${String(i + 1).padStart(3, '0')}`;
                await Ticket.create({
                    id_batch: batch.id!,
                    qr_code: uuidv4(),
                    code_ticket,
                    status: 'DISPONIBLE',
                    date_expiration,
                    prix_unitaire,
                }, { transaction: t });
            }

            return { ...batch.toJSON(), tickets_created: input.quantite, date_expiration };
        });

        return result;
    },
};
