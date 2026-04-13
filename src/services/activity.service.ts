import { Activity, Batch, Ticket } from "../models";
import { Op } from "sequelize";
import { ActivityData } from "../data/activity.data";

type TarifEntry = { forfait: string; prix: number };

function computeTarifsDisponibles(activity: Activity): TarifEntry[] {
    const toNum = (v: any) => parseFloat(v as any) || 0;

    if (activity.isMonthlyOnly) {
        const prix = toNum(activity.prix_mensuel);
        return prix > 0 ? [{ forfait: 'MENSUEL', prix }] : [];
    }

    const candidates: Array<{ forfait: string; field: keyof Activity }> = [
        { forfait: 'HEBDO',       field: 'prix_hebdomadaire' },
        { forfait: 'MENSUEL',     field: 'prix_mensuel' },
        { forfait: 'TRIMESTRIEL', field: 'prix_trimestriel' },
        { forfait: 'ANNUEL',      field: 'prix_annuel' },
    ];

    return candidates
        .map(({ forfait, field }) => ({ forfait, prix: toNum(activity[field]) }))
        .filter(({ prix }) => prix > 0);
}

export const ActivityService = {
    async list(query: { status?: string }) {
        const where: any = {};
        if (query.status === 'true') where.status = true;
        const rows = await ActivityData.findAll(where);
        return rows.map(a => ({ ...a.toJSON(), tarifs_disponibles: computeTarifsDisponibles(a) }));
    },

    async getById(id: number) {
        const activity = await ActivityData.findByPk(id);
        if (!activity) throw Object.assign(new Error('Activity not found'), { status: 404 });
        return { ...activity.toJSON(), tarifs_disponibles: computeTarifsDisponibles(activity) };
    },

    async create(input: any) {
        if (!input.nom?.trim()) {
            throw Object.assign(new Error('Le nom est requis'), { status: 400 });
        }
        const activity = await ActivityData.create({
            nom: input.nom.trim(),
            status: input.status ?? true,
            active: true,
            frais_inscription:   input.frais_inscription   ?? 0,
            prix_ticket:         input.prix_ticket         ?? 0,
            prix_hebdomadaire:   input.prix_hebdomadaire   ?? 0,
            prix_mensuel:        input.prix_mensuel        ?? 0,
            prix_trimestriel:    input.prix_trimestriel    ?? 0,
            prix_annuel:         input.prix_annuel         ?? 0,
            isMonthlyOnly:       input.isMonthlyOnly       ?? false,
        });
        return { ...activity.toJSON(), tarifs_disponibles: computeTarifsDisponibles(activity) };
    },

    async update(id: number, input: any) {
        const activity = await ActivityData.findByPk(id);
        if (!activity) throw Object.assign(new Error('Activity not found'), { status: 404 });

        const allowed = ['nom','status','frais_inscription','prix_ticket','prix_hebdomadaire',
                         'prix_mensuel','prix_trimestriel','prix_annuel','isMonthlyOnly'];
        const values: any = {};
        for (const key of allowed) {
            if (input[key] !== undefined) values[key] = input[key];
        }
        if (values.nom !== undefined && !values.nom.trim()) {
            throw Object.assign(new Error('Le nom ne peut pas être vide'), { status: 400 });
        }

        await ActivityData.update(id, values);
        const updated = await ActivityData.findByPk(id) as Activity;
        return { ...updated.toJSON(), tarifs_disponibles: computeTarifsDisponibles(updated) };
    },

    async softDelete(id: number) {
        const activity = await ActivityData.findByPk(id);
        if (!activity) throw Object.assign(new Error('Activity not found'), { status: 404 });

        const batches = await Batch.unscoped().findAll({
            where: { id_activity: id },
            attributes: ['id'],
        });
        const batchIds = batches.map((b) => b.id!).filter((id) => id != null);

        await ActivityData.update(id, { active: false, status: false });
        await Batch.update({ active: false }, { where: { id_activity: id } });

        if (batchIds.length > 0) {
            await Ticket.update(
                { active: false },
                { where: { id_batch: { [Op.in]: batchIds }, status: 'DISPONIBLE' } },
            );
        }

        return { message: 'Activity désactivée' };
    },
};
