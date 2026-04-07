import { Op, Transaction as SequelizeTransaction, WhereOptions } from "sequelize";
import { AccessLog, Ticket, User } from "../models";
import { ResultatScan } from "../models/accesslog.model";

type LogFilters = {
    resultat?: ResultatScan;
    date_debut?: string;
    date_fin?: string;
};

export const AccessLogData = {
    buildWhere(filters: LogFilters): WhereOptions {
        const where: any = {};
        if (filters.resultat) where.resultat = filters.resultat;
        if (filters.date_debut && filters.date_fin) {
            where.date_scan = { [Op.between]: [new Date(filters.date_debut), new Date(filters.date_fin + 'T23:59:59')] };
        } else if (filters.date_debut) {
            where.date_scan = { [Op.gte]: new Date(filters.date_debut) };
        } else if (filters.date_fin) {
            where.date_scan = { [Op.lte]: new Date(filters.date_fin + 'T23:59:59') };
        }
        return where;
    },

    findAll(filters: LogFilters = {}) {
        return AccessLog.findAll({
            where: this.buildWhere(filters),
            include: [
                { model: User, attributes: ['id', 'fullName'] },
                { model: Ticket, attributes: ['id', 'code_ticket', 'qr_code', 'status'] },
            ],
            order: [['date_scan', 'DESC']],
        });
    },

    create(values: Partial<AccessLog['_creationAttributes']>, t?: SequelizeTransaction) {
        return AccessLog.create(values as any, { transaction: t });
    },
};
