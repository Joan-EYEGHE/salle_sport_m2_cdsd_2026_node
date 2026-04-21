import { Activity, Member, sequelize, Subscription, Transaction } from "../models";
import { AccessLogData } from "../data/accesslog.data";
import { MemberData } from "../data/member.data";
import { TransactionData } from "../data/transaction.data";
import { TypeForfait } from "../models/subscription.model";

const FORFAIT_DAYS: Record<TypeForfait, number> = {
    HEBDO:       7,
    MENSUEL:     30,
    TRIMESTRIEL: 90,
    ANNUEL:      365,
};

const FORFAIT_PRIX_FIELD: Record<TypeForfait, keyof Activity> = {
    HEBDO:       'prix_hebdomadaire',
    MENSUEL:     'prix_mensuel',
    TRIMESTRIEL: 'prix_trimestriel',
    ANNUEL:      'prix_annuel',
};

function addDays(dateStr: string, days: number): string {
    const [year, month, day] = dateStr.split('-').map(Number);
    const d = new Date(year, month - 1, day);
    d.setDate(d.getDate() + days);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${dd}`;
}

export const MemberService = {
    async list() {
        return MemberData.findAll();
    },

    async getById(idOrSlug: string | number) {
        const isSlug = isNaN(Number(idOrSlug));
        const member = isSlug
            ? await MemberData.findBySlug(String(idOrSlug))
            : await MemberData.findByPk(Number(idOrSlug));
        if (!member) throw Object.assign(new Error('Member not found'), { status: 404 });
        return member;
    },

    async create(input: {
        prenom: string;
        nom: string;
        email?: string | null;
        phone: string;
        date_naissance?: string | null;
    }) {
        if (!input.prenom?.trim()) throw Object.assign(new Error('Le prénom est requis'), { status: 400 });
        if (!input.nom?.trim()) throw Object.assign(new Error('Le nom est requis'), { status: 400 });
        if (!input.phone?.trim()) throw Object.assign(new Error('Le téléphone est requis'), { status: 400 });

        const emailTrim = input.email?.trim();
        if (emailTrim) {
            const existing = await Member.findOne({ where: { email: emailTrim } });
            if (existing) throw Object.assign(new Error('Email déjà utilisé'), { status: 409 });
        }

        const dn = input.date_naissance?.trim();
        const member = await MemberData.create({
            prenom: input.prenom.trim(),
            nom: input.nom.trim(),
            email: emailTrim || null,
            phone: input.phone.trim(),
            date_naissance: dn || null,
        });
        return MemberData.findByPk(member.id!);
    },

    async findByQr(uuid: string) {
        const member = await MemberData.findByQr(uuid);
        if (!member) throw Object.assign(new Error('Member not found'), { status: 404 });
        return member;
    },

    async validateQr(uuid_qr: string, controllerId: number) {
        const member = await MemberData.findByQr(uuid_qr);

        if (!member) {
            await AccessLogData.create({
                id_ticket: null,
                id_membre: null,
                resultat: 'ECHEC',
                id_controller: controllerId,
                date_scan: new Date(),
            });
            return { valid: false, reason: 'Membre introuvable', member_info: null };
        }

        const m = member as Member & { subscriptions?: Subscription[] };
        const subs = m.subscriptions ?? [];
        const activeSub = subs.find(
            (s: Subscription) => new Date(s.date_prochain_paiement) >= new Date(),
        );

        const valid = !!activeSub;

        await AccessLogData.create({
            id_ticket: null,
            id_membre: member.id!,
            resultat: valid ? 'SUCCES' : 'ECHEC',
            id_controller: controllerId,
            date_scan: new Date(),
        });

        const act = activeSub
            ? ((activeSub as any).activity ?? (activeSub as any).Activity) as Activity | undefined
            : undefined;
        const activityNom = act && typeof (act as any).nom === 'string' ? { nom: (act as any).nom as string } : null;

        return {
            valid,
            reason: valid ? null : 'Aucun abonnement actif',
            member_info: {
                id: member.id,
                nom: member.nom,
                prenom: member.prenom,
                uuid_qr: member.uuid_qr,
                subscription: activeSub
                    ? {
                        type_forfait: activeSub.type_forfait,
                        date_prochain_paiement: (() => {
                            const d = activeSub.date_prochain_paiement as unknown;
                            return d instanceof Date ? d.toISOString() : String(d);
                        })(),
                        activity: activityNom,
                    }
                    : null,
            },
        };
    },

    async update(idOrSlug: string | number, input: any) {
        const isSlug = isNaN(Number(idOrSlug));
        const member = isSlug
            ? await MemberData.findBySlug(String(idOrSlug))
            : await MemberData.findByPk(Number(idOrSlug));
        if (!member) throw Object.assign(new Error('Member not found'), { status: 404 });

        const allowed = ['nom', 'prenom', 'email', 'phone', 'date_naissance', 'adresse'];
        const values: any = {};
        for (const key of allowed) {
            if (input[key] !== undefined) values[key] = input[key];
        }

        if (values.email !== undefined) {
            const et = typeof values.email === 'string' ? values.email.trim() : values.email;
            values.email = et ? et : null;
        }

        if (values.email) {
            const existing = await Member.findOne({ where: { email: values.email } });
            if (existing && existing.id !== member.id) {
                throw Object.assign(new Error('Email déjà utilisé'), { status: 409 });
            }
        }

        await MemberData.update(member.id!, values);
        return MemberData.findByPk(member.id!);
    },

    async subscribe(body: {
        membre: { nom: string; prenom: string; email?: string; phone?: string; date_naissance?: string; adresse?: string };
        abonnement: {
            id_activity: number;
            type_forfait: TypeForfait;
            frais_inscription_payes?: number;
            frais_uniquement?: boolean;
            date_debut: string;
            montant_override?: number;
        };
    }) {
        const { membre: membreInput, abonnement } = body;

        if (!membreInput.nom?.trim()) throw Object.assign(new Error('Le nom est requis'), { status: 400 });
        if (!membreInput.prenom?.trim()) throw Object.assign(new Error('Le prénom est requis'), { status: 400 });
        if (!abonnement.date_debut) throw Object.assign(new Error('La date de début est requise'), { status: 400 });
        if (!abonnement.type_forfait) throw Object.assign(new Error('Le type de forfait est requis'), { status: 400 });

        const result = await sequelize.transaction(async (t) => {
            const member = await MemberData.create({
                nom: membreInput.nom.trim(),
                prenom: membreInput.prenom.trim(),
                email: membreInput.email ?? null,
                phone: membreInput.phone ?? null,
                date_naissance: membreInput.date_naissance ?? null,
                adresse: membreInput.adresse ?? null,
            }, t);

            const activity = await Activity.findByPk(abonnement.id_activity, {
                transaction: t,
                lock: t.LOCK.UPDATE,
            });
            if (!activity) throw Object.assign(new Error('Activité introuvable'), { status: 404 });
            if (!activity.status || !activity.active) {
                throw Object.assign(new Error('Activité inactive'), { status: 400 });
            }

            const fraisInscription = Number(abonnement.frais_inscription_payes ?? 0);
            let montant_total: number;

            if (abonnement.montant_override != null && abonnement.montant_override !== undefined) {
                montant_total = Number(abonnement.montant_override);
            } else if (abonnement.frais_uniquement) {
                montant_total = fraisInscription;
            } else {
                const priceField = FORFAIT_PRIX_FIELD[abonnement.type_forfait];
                const prixForfait = parseFloat(activity[priceField] as any) || 0;
                montant_total = prixForfait + fraisInscription;
            }

            const date_prochain_paiement = addDays(abonnement.date_debut, FORFAIT_DAYS[abonnement.type_forfait]);

            await Subscription.create({
                id_membre: member.id!,
                id_activity: abonnement.id_activity,
                type_forfait: abonnement.type_forfait,
                frais_inscription_payes: fraisInscription,
                frais_uniquement: abonnement.frais_uniquement ?? false,
                montant_total,
                date_debut: abonnement.date_debut,
                date_prochain_paiement,
            }, { transaction: t });

            await TransactionData.create({
                type: 'REVENU',
                libelle: `Inscription ${member.nom} ${member.prenom} - ${activity.nom}`,
                montant: montant_total,
                id_membre: member.id!,
                date: new Date(),
            }, t);

            return MemberData.reloadWithSubscription(member.id!, t);
        });

        return result;
    },

    async softDelete(id: number) {
        const member = await MemberData.findByPk(id);
        if (!member) throw Object.assign(new Error('Member not found'), { status: 404 });
        await Member.update({ active: false }, { where: { id: member.id } });
        await Subscription.update({ active: false }, { where: { id_membre: member.id, active: true } });
    },
};
