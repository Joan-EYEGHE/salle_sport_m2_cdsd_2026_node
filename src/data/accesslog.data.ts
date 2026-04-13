import { Op, Transaction as SequelizeTransaction, WhereOptions } from "sequelize";
import { AccessLog, Activity, Batch, Member, Ticket, User } from "../models";
import { ResultatScan } from "../models/accesslog.model";

export type LogFilters = {
    resultat?: ResultatScan;
    date_debut?: string;
    date_fin?: string;
    period?: string;
    memberId?: number;
};

export const AccessLogData = {
    buildWhere(filters: LogFilters): WhereOptions {
        const where: any = {};
        if (filters.resultat) where.resultat = filters.resultat;

        let dateCond: any = null;
        if (filters.period === 'today') {
            const s = new Date();
            s.setHours(0, 0, 0, 0);
            const e = new Date();
            e.setHours(23, 59, 59, 999);
            dateCond = { [Op.between]: [s, e] };
        } else if (filters.date_debut && filters.date_fin) {
            dateCond = { [Op.between]: [new Date(filters.date_debut), new Date(filters.date_fin + 'T23:59:59')] };
        } else if (filters.date_debut) {
            dateCond = { [Op.gte]: new Date(filters.date_debut) };
        } else if (filters.date_fin) {
            dateCond = { [Op.lte]: new Date(filters.date_fin + 'T23:59:59') };
        }

        if (dateCond) {
            where.date_scan = dateCond;
        }

        if (filters.memberId != null && Number.isFinite(filters.memberId)) {
            where.id_membre = filters.memberId;
        }

        return where;
    },

    findAll(filters: LogFilters & { limit?: number; sort?: 'asc' | 'desc' } = {}) {
        const orderDir = filters.sort === 'asc' ? 'ASC' : 'DESC';
        const lim = filters.limit != null && Number(filters.limit) > 0
            ? Math.min(500, Number(filters.limit))
            : undefined;

        const { limit: _l, sort: _s, ...whereFilters } = filters;

        return AccessLog.findAll({
            where: this.buildWhere(whereFilters),
            include: [
                { model: User, attributes: ['id', 'fullName'] },
                {
                    model: Ticket,
                    required: false,
                    include: [{ model: Batch, include: [{ model: Activity, attributes: ['id', 'nom'] }] }],
                },
                { model: Member, as: 'membre', attributes: ['id', 'nom', 'prenom'], required: false },
            ],
            order: [['date_scan', orderDir]],
            limit: lim,
        });
    },

    create(values: Partial<AccessLog['_creationAttributes']>, t?: SequelizeTransaction) {
        return AccessLog.create(values as any, { transaction: t });
    },
};
