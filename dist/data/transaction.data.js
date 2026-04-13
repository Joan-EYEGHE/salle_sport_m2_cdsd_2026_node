"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionData = void 0;
const sequelize_1 = require("sequelize");
const models_1 = require("../models");
exports.TransactionData = {
    buildWhere(filters) {
        const where = {};
        if (filters.type) {
            where.type = filters.type;
        }
        if (filters.date_debut && filters.date_fin) {
            where.date = { [sequelize_1.Op.between]: [new Date(filters.date_debut), new Date(filters.date_fin + 'T23:59:59')] };
        }
        else if (filters.date_debut) {
            where.date = { [sequelize_1.Op.gte]: new Date(filters.date_debut) };
        }
        else if (filters.date_fin) {
            where.date = { [sequelize_1.Op.lte]: new Date(filters.date_fin + 'T23:59:59') };
        }
        if (filters.memberId != null && Number.isFinite(filters.memberId)) {
            where.id_membre = filters.memberId;
        }
        return where;
    },
    findAll(filters = {}) {
        return models_1.Transaction.findAll({
            where: this.buildWhere(filters),
            include: [{ model: models_1.Member, as: 'member', attributes: ['id', 'nom', 'prenom'] }],
            order: [['date', 'DESC']],
        });
    },
    create(values, t) {
        return models_1.Transaction.create(values, { transaction: t });
    },
};
