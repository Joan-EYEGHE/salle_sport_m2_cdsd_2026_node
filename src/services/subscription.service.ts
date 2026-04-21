import { Op } from "sequelize";
import { TransactionData } from "../data/transaction.data";
import { Activity, Member, sequelize, Subscription } from "../models";
import { TypeForfait } from "../models/subscription.model";

const FORFAIT_DAYS: Record<TypeForfait, number> = {
    HEBDO: 7,
    MENSUEL: 30,
    TRIMESTRIEL: 90,
    ANNUEL: 365,
};

const FORFAIT_PRIX_FIELD: Record<TypeForfait, keyof Activity> = {
    HEBDO: "prix_hebdomadaire",
    MENSUEL: "prix_mensuel",
    TRIMESTRIEL: "prix_trimestriel",
    ANNUEL: "prix_annuel",
};

const FORFAIT_VALUES: TypeForfait[] = ["HEBDO", "MENSUEL", "TRIMESTRIEL", "ANNUEL"];

function addDays(dateStr: string, days: number): string {
    const [year, month, day] = dateStr.split("-").map(Number);
    const d = new Date(year, month - 1, day);
    d.setDate(d.getDate() + days);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${dd}`;
}

export type CreateSubscriptionInput = {
    id_membre: number;
    id_activity: number;
    type_forfait: TypeForfait;
    date_debut: string;
    frais_inscription_payes?: number;
    frais_uniquement?: boolean;
    montant_override?: number;
};

function todayYmd(): string {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
}

function addDaysYmd(base: string, days: number): string {
    const [y, mo, da] = base.split("-").map(Number);
    const d = new Date(y, mo - 1, da);
    d.setDate(d.getDate() + days);
    const yy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yy}-${mm}-${dd}`;
}

export const SubscriptionService = {
    async create(input: CreateSubscriptionInput) {
        const idMembre = Number(input.id_membre);
        const idActivity = Number(input.id_activity);
        if (!Number.isFinite(idMembre) || idMembre <= 0) {
            throw Object.assign(new Error("id_membre invalide"), { status: 400 });
        }
        if (!Number.isFinite(idActivity) || idActivity <= 0) {
            throw Object.assign(new Error("id_activity invalide"), { status: 400 });
        }
        if (!input.date_debut?.trim()) {
            throw Object.assign(new Error("La date de début est requise"), { status: 400 });
        }
        if (!FORFAIT_VALUES.includes(input.type_forfait)) {
            throw Object.assign(new Error("type_forfait invalide"), { status: 400 });
        }

        const subscriptionRow = await sequelize.transaction(async (t) => {
            const member = await Member.findByPk(idMembre, {
                transaction: t,
                lock: t.LOCK.UPDATE,
            });
            if (!member) {
                throw Object.assign(new Error("Membre introuvable"), { status: 404 });
            }

            const activity = await Activity.findByPk(idActivity, {
                transaction: t,
                lock: t.LOCK.UPDATE,
            });
            if (!activity) {
                throw Object.assign(new Error("Activité introuvable"), { status: 404 });
            }
            if (!activity.status) {
                throw Object.assign(new Error("Activité inactive"), { status: 400 });
            }

            const fraisInscription = Number(input.frais_inscription_payes ?? 0);
            let montant_total: number;

            if (input.montant_override != null && input.montant_override !== undefined) {
                montant_total = Number(input.montant_override);
            } else if (input.frais_uniquement) {
                montant_total = fraisInscription;
            } else {
                const priceField = FORFAIT_PRIX_FIELD[input.type_forfait];
                const raw = activity.get(priceField);
                const prixForfait =
                    typeof raw === "number" ? raw : parseFloat(String(raw ?? "0")) || 0;
                montant_total = prixForfait + fraisInscription;
            }

            if (!Number.isFinite(montant_total) || montant_total < 0) {
                throw Object.assign(new Error("Montant total invalide"), { status: 400 });
            }

            const date_prochain_paiement = addDays(input.date_debut.trim(), FORFAIT_DAYS[input.type_forfait]);

            const subscription = await Subscription.create(
                {
                    id_membre: idMembre,
                    id_activity: idActivity,
                    type_forfait: input.type_forfait,
                    frais_inscription_payes: fraisInscription,
                    frais_uniquement: input.frais_uniquement ?? false,
                    montant_total,
                    date_debut: input.date_debut.trim(),
                    date_prochain_paiement,
                },
                { transaction: t },
            );

            await TransactionData.create(
                {
                    type: "REVENU",
                    libelle: "",
                    montant: montant_total,
                    id_membre: idMembre,
                    date: new Date(),
                },
                t,
            );

            return subscription;
        });

        const full = await Subscription.findByPk(subscriptionRow.id, {
            include: [
                { model: Member, as: 'member', required: false },
                { model: Activity, required: false },
            ],
        });
        if (!full) {
            throw Object.assign(new Error("Subscription not found"), { status: 404 });
        }
        return full;
    },

    async list(filters: {
        memberId?: number;
        activityId?: number;
        status?: string;
    }) {
        const where: Record<string, unknown> = {};
        if (filters.memberId != null) where.id_membre = filters.memberId;
        if (filters.activityId != null) where.id_activity = filters.activityId;
        if (filters.status === "active") {
            where.date_prochain_paiement = { [Op.gte]: todayYmd() };
        }

        return Subscription.findAll({
            where,
            include: [
                { model: Member, as: 'member', required: false },
                { model: Activity, required: false },
            ],
            order: [["createdAt", "DESC"]],
        });
    },

    async getById(id: number) {
        const sub = await Subscription.findByPk(id, {
            include: [
                { model: Member, as: 'member', required: false },
                { model: Activity, required: false },
            ],
        });
        if (!sub) throw Object.assign(new Error("Subscription not found"), { status: 404 });
        return sub;
    },

    async expiringSoon(days: number) {
        const start = todayYmd();
        const end = addDaysYmd(start, days);
        return Subscription.findAll({
            where: {
                date_prochain_paiement: {
                    [Op.and]: [{ [Op.gte]: start }, { [Op.lte]: end }],
                },
            },
            include: [
                { model: Member, as: 'member', required: false },
                { model: Activity, required: false },
            ],
            order: [["date_prochain_paiement", "ASC"]],
        });
    },

    async remove(id: number) {
        const [n] = await Subscription.update({ active: false }, { where: { id } });
        if (n === 0) throw Object.assign(new Error("Subscription not found"), { status: 404 });
    },
};
