import { Transaction as SequelizeTransaction } from "sequelize";
import { Activity, Member, Subscription, Transaction } from "../models";

export const MemberData = {
    findAll() {
        return Member.findAll({
            include: [{
                model: Subscription,
                as: 'subscriptions',
                separate: true,
                order: [['createdAt', 'DESC']],
                limit: 1,
                include: [{ model: Activity }],
            }],
            order: [['nom', 'ASC']],
        });
    },

    findByPk(id: number) {
        return Member.findByPk(id, {
            include: [
                {
                    model: Subscription,
                    as: 'subscriptions',
                    separate: true,
                    order: [['createdAt', 'DESC']],
                    include: [{ model: Activity }],
                },
                {
                    model: Transaction,
                    separate: true,
                    order: [['createdAt', 'DESC']],
                },
            ],
        });
    },

    findByQr(uuid_qr: string) {
        return Member.findOne({
            where: { uuid_qr },
            include: [{
                model: Subscription,
                as: 'subscriptions',
                separate: true,
                order: [['createdAt', 'DESC']],
                include: [{ model: Activity }],
            }],
        });
    },

    findBySlug(slug: string) {
        return Member.findOne({
            where: { slug },
            include: [
                {
                    model: Subscription,
                    as: 'subscriptions',
                    separate: true,
                    order: [['createdAt', 'DESC']],
                    include: [{ model: Activity }],
                },
                {
                    model: Transaction,
                    separate: true,
                    order: [['createdAt', 'DESC']],
                },
            ],
        });
    },

    create(values: Partial<Member['_creationAttributes']>, t?: SequelizeTransaction) {
        return Member.create(values as any, { transaction: t });
    },

    update(id: number, values: Partial<Member['_creationAttributes']>) {
        return Member.update(values as any, { where: { id } });
    },

    reloadWithSubscription(id: number, t?: SequelizeTransaction) {
        return Member.findByPk(id, {
            include: [{
                model: Subscription,
                as: 'subscriptions',
                separate: true,
                order: [['createdAt', 'DESC']],
                limit: 1,
                include: [{ model: Activity }],
            }],
            transaction: t,
        });
    },
};
