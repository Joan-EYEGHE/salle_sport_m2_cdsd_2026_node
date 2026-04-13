"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BatchData = void 0;
const models_1 = require("../models");
exports.BatchData = {
    findAll() {
        return models_1.Batch.findAll({
            include: [
                { model: models_1.Activity, attributes: ['id', 'nom'] },
                { model: models_1.Ticket, attributes: ['id', 'status'] },
            ],
            order: [['createdAt', 'DESC']],
        });
    },
    findByPk(id) {
        return models_1.Batch.findByPk(id, {
            include: [
                { model: models_1.Activity, attributes: ['id', 'nom', 'prix_ticket'] },
                { model: models_1.Ticket },
            ],
        });
    },
    create(values, t) {
        return models_1.Batch.create(values, { transaction: t });
    },
};
