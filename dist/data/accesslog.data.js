"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccessLogData = void 0;
const sequelize_1 = require("sequelize");
const models_1 = require("../models");
exports.AccessLogData = {
    buildWhere(filters) {
        const where = {};
        if (filters.resultat)
            where.resultat = filters.resultat;
        let dateCond = null;
        if (filters.period === 'today') {
            const s = new Date();
            s.setHours(0, 0, 0, 0);
            const e = new Date();
            e.setHours(23, 59, 59, 999);
            dateCond = { [sequelize_1.Op.between]: [s, e] };
        }
        else if (filters.date_debut && filters.date_fin) {
            dateCond = { [sequelize_1.Op.between]: [new Date(filters.date_debut), new Date(filters.date_fin + 'T23:59:59')] };
        }
        else if (filters.date_debut) {
            dateCond = { [sequelize_1.Op.gte]: new Date(filters.date_debut) };
        }
        else if (filters.date_fin) {
            dateCond = { [sequelize_1.Op.lte]: new Date(filters.date_fin + 'T23:59:59') };
        }
        if (dateCond) {
            where.date_scan = dateCond;
        }
        if (filters.memberId != null && Number.isFinite(filters.memberId)) {
            where.id_membre = filters.memberId;
        }
        return where;
    },
    findAll(filters = {}) {
        const orderDir = filters.sort === 'asc' ? 'ASC' : 'DESC';
        const lim = filters.limit != null && Number(filters.limit) > 0
            ? Math.min(500, Number(filters.limit))
            : undefined;
        const { limit: _l, sort: _s, ...whereFilters } = filters;
        return models_1.AccessLog.findAll({
            where: this.buildWhere(whereFilters),
            include: [
                { model: models_1.User, attributes: ['id', 'fullName'] },
                {
                    model: models_1.Ticket,
                    required: false,
                    include: [{ model: models_1.Batch, include: [{ model: models_1.Activity, attributes: ['id', 'nom'] }] }],
                },
                { model: models_1.Member, as: 'membre', attributes: ['id', 'nom', 'prenom'], required: false },
            ],
            order: [['date_scan', orderDir]],
            limit: lim,
        });
    },
    create(values, t) {
        return models_1.AccessLog.create(values, { transaction: t });
    },
};
