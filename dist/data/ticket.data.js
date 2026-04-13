"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TicketData = void 0;
const sequelize_1 = require("sequelize");
const models_1 = require("../models");
exports.TicketData = {
    findAll(filters = {}) {
        const where = {};
        if (filters.status)
            where.status = filters.status;
        if (filters.batch_id)
            where.id_batch = filters.batch_id;
        if (filters.memberId != null && Number.isFinite(filters.memberId)) {
            where.id_membre = filters.memberId;
        }
        return models_1.Ticket.findAll({
            where,
            include: [
                { model: models_1.Batch, include: [{ model: models_1.Activity, attributes: ['id', 'nom'] }] },
                { model: models_1.Member, as: 'member', attributes: ['id', 'nom', 'prenom'], required: false },
            ],
            order: [['createdAt', 'DESC']],
        });
    },
    findByPk(id) {
        return models_1.Ticket.findByPk(id, {
            include: [
                { model: models_1.Batch, include: [{ model: models_1.Activity, attributes: ['id', 'nom'] }] },
                { model: models_1.Member, as: 'member', attributes: ['id', 'nom', 'prenom'], required: false },
            ],
        });
    },
    findByCode(code) {
        return models_1.Ticket.findOne({
            where: {
                [sequelize_1.Op.or]: [
                    { qr_code: code },
                    { code_ticket: code },
                ],
            },
        });
    },
    update(id, values, t) {
        return models_1.Ticket.update(values, { where: { id }, transaction: t });
    },
};
