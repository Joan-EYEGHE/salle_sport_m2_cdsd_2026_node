"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemberData = void 0;
const models_1 = require("../models");
exports.MemberData = {
    findAll() {
        return models_1.Member.findAll({
            include: [{
                    model: models_1.Subscription,
                    separate: true,
                    order: [['createdAt', 'DESC']],
                    limit: 1,
                    include: [{ model: models_1.Activity }],
                }],
            order: [['nom', 'ASC']],
        });
    },
    findByPk(id) {
        return models_1.Member.findByPk(id, {
            include: [
                {
                    model: models_1.Subscription,
                    separate: true,
                    order: [['createdAt', 'DESC']],
                    include: [{ model: models_1.Activity }],
                },
                {
                    model: models_1.Transaction,
                    separate: true,
                    order: [['createdAt', 'DESC']],
                },
            ],
        });
    },
    findByQr(uuid_qr) {
        return models_1.Member.findOne({
            where: { uuid_qr },
            include: [{
                    model: models_1.Subscription,
                    separate: true,
                    order: [['createdAt', 'DESC']],
                    include: [{ model: models_1.Activity }],
                }],
        });
    },
    findBySlug(slug) {
        return models_1.Member.findOne({
            where: { slug },
            include: [
                {
                    model: models_1.Subscription,
                    separate: true,
                    order: [['createdAt', 'DESC']],
                    include: [{ model: models_1.Activity }],
                },
                {
                    model: models_1.Transaction,
                    separate: true,
                    order: [['createdAt', 'DESC']],
                },
            ],
        });
    },
    create(values, t) {
        return models_1.Member.create(values, { transaction: t });
    },
    update(id, values) {
        return models_1.Member.update(values, { where: { id } });
    },
    reloadWithSubscription(id, t) {
        return models_1.Member.findByPk(id, {
            include: [{
                    model: models_1.Subscription,
                    separate: true,
                    order: [['createdAt', 'DESC']],
                    limit: 1,
                    include: [{ model: models_1.Activity }],
                }],
            transaction: t,
        });
    },
};
