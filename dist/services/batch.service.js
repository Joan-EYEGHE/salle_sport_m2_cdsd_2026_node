"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BatchService = void 0;
const crypto_1 = require("crypto");
const models_1 = require("../models");
const batch_data_1 = require("../data/batch.data");
function buildDatePrefix(d) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `T${y}${m}${day}`;
}
function computeStatusCounts(tickets) {
    const counts = { DISPONIBLE: 0, VENDU: 0, UTILISE: 0, EXPIRE: 0 };
    for (const t of tickets) {
        const s = t.status;
        if (s && s in counts)
            counts[s]++;
    }
    return counts;
}
exports.BatchService = {
    async list() {
        const batches = await batch_data_1.BatchData.findAll();
        return batches.map(b => {
            const json = b.toJSON();
            const tickets = json.Tickets ?? [];
            return { ...json, ticket_counts: computeStatusCounts(tickets) };
        });
    },
    async getById(id) {
        const batch = await batch_data_1.BatchData.findByPk(id);
        if (!batch)
            throw Object.assign(new Error('Batch not found'), { status: 404 });
        const json = batch.toJSON();
        const tickets = json.Tickets ?? [];
        return { ...json, ticket_counts: computeStatusCounts(tickets) };
    },
    async generate(input) {
        if (!input.id_activity)
            throw Object.assign(new Error('id_activity est requis'), { status: 400 });
        if (!input.quantite || input.quantite <= 0)
            throw Object.assign(new Error('quantite doit être > 0'), { status: 400 });
        const result = await models_1.sequelize.transaction(async (t) => {
            const activity = await models_1.Activity.findByPk(input.id_activity, { transaction: t });
            if (!activity)
                throw Object.assign(new Error('Activité introuvable'), { status: 404 });
            if (!activity.status)
                throw Object.assign(new Error('Activité inactive'), { status: 400 });
            const prix_unitaire = input.prix_unitaire_applique != null
                ? Number(input.prix_unitaire_applique)
                : parseFloat(activity.prix_ticket) || 0;
            const batch = await models_1.Batch.create({
                id_activity: input.id_activity,
                quantite: input.quantite,
                prix_unitaire_applique: prix_unitaire,
            }, { transaction: t });
            const date_expiration = new Date(Date.now() + 24 * 60 * 60 * 1000);
            const prefix = buildDatePrefix(new Date());
            for (let i = 0; i < input.quantite; i++) {
                const code_ticket = `${prefix}-${String(i + 1).padStart(3, '0')}`;
                await models_1.Ticket.create({
                    id_batch: batch.id,
                    qr_code: (0, crypto_1.randomUUID)(),
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
