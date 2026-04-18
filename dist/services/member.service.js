"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemberService = void 0;
const models_1 = require("../models");
const member_data_1 = require("../data/member.data");
const transaction_data_1 = require("../data/transaction.data");
const FORFAIT_DAYS = {
    HEBDO: 7,
    MENSUEL: 30,
    TRIMESTRIEL: 90,
    ANNUEL: 365,
};
const FORFAIT_PRIX_FIELD = {
    HEBDO: 'prix_hebdomadaire',
    MENSUEL: 'prix_mensuel',
    TRIMESTRIEL: 'prix_trimestriel',
    ANNUEL: 'prix_annuel',
};
function addDays(dateStr, days) {
    const [year, month, day] = dateStr.split('-').map(Number);
    const d = new Date(year, month - 1, day);
    d.setDate(d.getDate() + days);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${dd}`;
}
exports.MemberService = {
    async list() {
        return member_data_1.MemberData.findAll();
    },
    async getById(idOrSlug) {
        const isSlug = isNaN(Number(idOrSlug));
        const member = isSlug
            ? await member_data_1.MemberData.findBySlug(String(idOrSlug))
            : await member_data_1.MemberData.findByPk(Number(idOrSlug));
        if (!member)
            throw Object.assign(new Error('Member not found'), { status: 404 });
        return member;
    },
    async create(input) {
        if (!input.prenom?.trim())
            throw Object.assign(new Error('Le prénom est requis'), { status: 400 });
        if (!input.nom?.trim())
            throw Object.assign(new Error('Le nom est requis'), { status: 400 });
        if (!input.phone?.trim())
            throw Object.assign(new Error('Le téléphone est requis'), { status: 400 });
        const emailTrim = input.email?.trim();
        if (emailTrim) {
            const existing = await models_1.Member.findOne({ where: { email: emailTrim } });
            if (existing)
                throw Object.assign(new Error('Email déjà utilisé'), { status: 409 });
        }
        const dn = input.date_naissance?.trim();
        const member = await member_data_1.MemberData.create({
            prenom: input.prenom.trim(),
            nom: input.nom.trim(),
            email: emailTrim || null,
            phone: input.phone.trim(),
            date_naissance: dn || null,
        });
        return member_data_1.MemberData.findByPk(member.id);
    },
    async findByQr(uuid) {
        const member = await member_data_1.MemberData.findByQr(uuid);
        if (!member)
            throw Object.assign(new Error('Member not found'), { status: 404 });
        return member;
    },
    async update(idOrSlug, input) {
        const isSlug = isNaN(Number(idOrSlug));
        const member = isSlug
            ? await member_data_1.MemberData.findBySlug(String(idOrSlug))
            : await member_data_1.MemberData.findByPk(Number(idOrSlug));
        if (!member)
            throw Object.assign(new Error('Member not found'), { status: 404 });
        const allowed = ['nom', 'prenom', 'email', 'phone', 'date_naissance', 'adresse'];
        const values = {};
        for (const key of allowed) {
            if (input[key] !== undefined)
                values[key] = input[key];
        }
        if (values.email !== undefined) {
            const et = typeof values.email === 'string' ? values.email.trim() : values.email;
            values.email = et ? et : null;
        }
        if (values.email) {
            const existing = await models_1.Member.findOne({ where: { email: values.email } });
            if (existing && existing.id !== member.id) {
                throw Object.assign(new Error('Email déjà utilisé'), { status: 409 });
            }
        }
        await member_data_1.MemberData.update(member.id, values);
        return member_data_1.MemberData.findByPk(member.id);
    },
    async subscribe(body) {
        const { membre: membreInput, abonnement } = body;
        if (!membreInput.nom?.trim())
            throw Object.assign(new Error('Le nom est requis'), { status: 400 });
        if (!membreInput.prenom?.trim())
            throw Object.assign(new Error('Le prénom est requis'), { status: 400 });
        if (!abonnement.date_debut)
            throw Object.assign(new Error('La date de début est requise'), { status: 400 });
        if (!abonnement.type_forfait)
            throw Object.assign(new Error('Le type de forfait est requis'), { status: 400 });
        const result = await models_1.sequelize.transaction(async (t) => {
            const member = await member_data_1.MemberData.create({
                nom: membreInput.nom.trim(),
                prenom: membreInput.prenom.trim(),
                email: membreInput.email ?? null,
                phone: membreInput.phone ?? null,
                date_naissance: membreInput.date_naissance ?? null,
                adresse: membreInput.adresse ?? null,
            }, t);
            const activity = await models_1.Activity.findByPk(abonnement.id_activity, {
                transaction: t,
                lock: t.LOCK.UPDATE,
            });
            if (!activity)
                throw Object.assign(new Error('Activité introuvable'), { status: 404 });
            if (!activity.status || !activity.active) {
                throw Object.assign(new Error('Activité inactive'), { status: 400 });
            }
            const fraisInscription = Number(abonnement.frais_inscription_payes ?? 0);
            let montant_total;
            if (abonnement.montant_override != null && abonnement.montant_override !== undefined) {
                montant_total = Number(abonnement.montant_override);
            }
            else if (abonnement.frais_uniquement) {
                montant_total = fraisInscription;
            }
            else {
                const priceField = FORFAIT_PRIX_FIELD[abonnement.type_forfait];
                const prixForfait = parseFloat(activity[priceField]) || 0;
                montant_total = prixForfait + fraisInscription;
            }
            const date_prochain_paiement = addDays(abonnement.date_debut, FORFAIT_DAYS[abonnement.type_forfait]);
            await models_1.Subscription.create({
                id_membre: member.id,
                id_activity: abonnement.id_activity,
                type_forfait: abonnement.type_forfait,
                frais_inscription_payes: fraisInscription,
                frais_uniquement: abonnement.frais_uniquement ?? false,
                montant_total,
                date_debut: abonnement.date_debut,
                date_prochain_paiement,
            }, { transaction: t });
            await transaction_data_1.TransactionData.create({
                type: 'REVENU',
                libelle: `Inscription ${member.nom} ${member.prenom} - ${activity.nom}`,
                montant: montant_total,
                id_membre: member.id,
                date: new Date(),
            }, t);
            return member_data_1.MemberData.reloadWithSubscription(member.id, t);
        });
        return result;
    },
    async softDelete(id) {
        const member = await member_data_1.MemberData.findByPk(id);
        if (!member)
            throw Object.assign(new Error('Member not found'), { status: 404 });
        await models_1.Member.update({ active: false }, { where: { id: member.id } });
        await models_1.Subscription.update({ active: false }, { where: { id_membre: member.id, active: true } });
    },
};
