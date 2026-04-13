"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActivityService = void 0;
const models_1 = require("../models");
const sequelize_1 = require("sequelize");
const activity_data_1 = require("../data/activity.data");
function computeTarifsDisponibles(activity) {
    const toNum = (v) => parseFloat(v) || 0;
    if (activity.isMonthlyOnly) {
        const prix = toNum(activity.prix_mensuel);
        return prix > 0 ? [{ forfait: 'MENSUEL', prix }] : [];
    }
    const candidates = [
        { forfait: 'HEBDO', field: 'prix_hebdomadaire' },
        { forfait: 'MENSUEL', field: 'prix_mensuel' },
        { forfait: 'TRIMESTRIEL', field: 'prix_trimestriel' },
        { forfait: 'ANNUEL', field: 'prix_annuel' },
    ];
    return candidates
        .map(({ forfait, field }) => ({ forfait, prix: toNum(activity[field]) }))
        .filter(({ prix }) => prix > 0);
}
exports.ActivityService = {
    async list(query) {
        const where = {};
        if (query.status === 'true')
            where.status = true;
        const rows = await activity_data_1.ActivityData.findAll(where);
        return rows.map(a => ({ ...a.toJSON(), tarifs_disponibles: computeTarifsDisponibles(a) }));
    },
    async getById(id) {
        const activity = await activity_data_1.ActivityData.findByPk(id);
        if (!activity)
            throw Object.assign(new Error('Activity not found'), { status: 404 });
        return { ...activity.toJSON(), tarifs_disponibles: computeTarifsDisponibles(activity) };
    },
    async create(input) {
        if (!input.nom?.trim()) {
            throw Object.assign(new Error('Le nom est requis'), { status: 400 });
        }
        const activity = await activity_data_1.ActivityData.create({
            nom: input.nom.trim(),
            status: input.status ?? true,
            active: true,
            frais_inscription: input.frais_inscription ?? 0,
            prix_ticket: input.prix_ticket ?? 0,
            prix_hebdomadaire: input.prix_hebdomadaire ?? 0,
            prix_mensuel: input.prix_mensuel ?? 0,
            prix_trimestriel: input.prix_trimestriel ?? 0,
            prix_annuel: input.prix_annuel ?? 0,
            isMonthlyOnly: input.isMonthlyOnly ?? false,
        });
        return { ...activity.toJSON(), tarifs_disponibles: computeTarifsDisponibles(activity) };
    },
    async update(id, input) {
        const activity = await activity_data_1.ActivityData.findByPk(id);
        if (!activity)
            throw Object.assign(new Error('Activity not found'), { status: 404 });
        const allowed = ['nom', 'status', 'frais_inscription', 'prix_ticket', 'prix_hebdomadaire',
            'prix_mensuel', 'prix_trimestriel', 'prix_annuel', 'isMonthlyOnly'];
        const values = {};
        for (const key of allowed) {
            if (input[key] !== undefined)
                values[key] = input[key];
        }
        if (values.nom !== undefined && !values.nom.trim()) {
            throw Object.assign(new Error('Le nom ne peut pas être vide'), { status: 400 });
        }
        await activity_data_1.ActivityData.update(id, values);
        const updated = await activity_data_1.ActivityData.findByPk(id);
        return { ...updated.toJSON(), tarifs_disponibles: computeTarifsDisponibles(updated) };
    },
    async softDelete(id) {
        const activity = await activity_data_1.ActivityData.findByPk(id);
        if (!activity)
            throw Object.assign(new Error('Activity not found'), { status: 404 });
        const batches = await models_1.Batch.unscoped().findAll({
            where: { id_activity: id },
            attributes: ['id'],
        });
        const batchIds = batches.map((b) => b.id).filter((id) => id != null);
        await activity_data_1.ActivityData.update(id, { active: false, status: false });
        await models_1.Batch.update({ active: false }, { where: { id_activity: id } });
        if (batchIds.length > 0) {
            await models_1.Ticket.update({ active: false }, { where: { id_batch: { [sequelize_1.Op.in]: batchIds }, status: 'DISPONIBLE' } });
        }
        return { message: 'Activity désactivée' };
    },
};
