import { Activity, Batch, Ticket } from "../models";
import { Op } from "sequelize";
import { ActivityData } from "../data/activity.data";
import { generateActivitySlug } from "../models/activity.model";

type TarifEntry = { forfait: string; prix: number };

/** Seuls les segments entièrement numériques sont des id ; le reste est un slug (évite isNaN(Number)). */
function isNumericIdParam(idOrSlug: string | number): boolean {
    const t = String(idOrSlug).trim();
    return t.length > 0 && /^\d+$/.test(t);
}

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

async function ensureActivitySlugRow(activity: Activity): Promise<Activity> {
    const j = activity.toJSON() as { id?: number; nom?: string; slug?: string | null };
    if (j.slug?.trim() || !j.nom?.trim()) return activity;
    const id = j.id;
    if (id == null) return activity;
    let slug = generateActivitySlug(String(j.nom));
    try {
        await ActivityData.update(id, { slug });
    } catch {
        slug = generateActivitySlug(`${String(j.nom)}-${id}`);
        await ActivityData.update(id, { slug });
    }
    const refreshed = await ActivityData.findByPk(id);
    return refreshed ?? activity;
}

export const ActivityService = {
    async list(query: { status?: string }) {
        const where: any = {};
        if (query.status === 'true') where.status = true;
        const rows = await ActivityData.findAll(where);
        const mapped: Array<Record<string, unknown> & { tarifs_disponibles: TarifEntry[] }> = [];
        for (const a of rows) {
            const fixed = await ensureActivitySlugRow(a);
            mapped.push({ ...fixed.toJSON(), tarifs_disponibles: computeTarifsDisponibles(fixed) });
        }
        return mapped;
    },

    async getById(idOrSlug: string | number) {
        const raw = String(idOrSlug).trim();
        let activity = isNumericIdParam(raw)
            ? await ActivityData.findByPk(Number(raw))
            : await ActivityData.findBySlug(raw);
        if (!activity) throw Object.assign(new Error('Activity not found'), { status: 404 });
        activity = await ensureActivitySlugRow(activity);
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

    async update(idOrSlug: string | number, input: any) {
        const raw = String(idOrSlug).trim();
        const existing = isNumericIdParam(raw)
            ? await ActivityData.findByPk(Number(raw))
            : await ActivityData.findBySlug(raw);
        if (!existing) throw Object.assign(new Error('Activity not found'), { status: 404 });
        const id = existing.id!;

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

    async softDelete(idOrSlug: string | number) {
        const raw = String(idOrSlug).trim();
        const activity = isNumericIdParam(raw)
            ? await ActivityData.findByPk(Number(raw))
            : await ActivityData.findBySlug(raw);
        if (!activity) throw Object.assign(new Error('Activity not found'), { status: 404 });
        const id = activity.id!;

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
