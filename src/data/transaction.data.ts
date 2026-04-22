import { Op, Transaction as SequelizeTransaction, WhereOptions } from "sequelize";
import { Member, Transaction } from "../models";
import { TypeTransaction } from "../models/transaction.model";

type ListFilters = {
    type?: TypeTransaction;
    date_debut?: string;
    date_fin?: string;
    memberId?: number;
};

export const TransactionData = {
    buildWhere(filters: ListFilters): WhereOptions {
        const where: any = {};
        if (filters.type) {
            where.type = filters.type;
        }
        if (filters.date_debut && filters.date_fin) {
            where.date = { [Op.between]: [new Date(filters.date_debut), new Date(filters.date_fin + 'T23:59:59')] };
        } else if (filters.date_debut) {
            where.date = { [Op.gte]: new Date(filters.date_debut) };
        } else if (filters.date_fin) {
            where.date = { [Op.lte]: new Date(filters.date_fin + 'T23:59:59') };
        }
        if (filters.memberId != null && Number.isFinite(filters.memberId)) {
            where.id_membre = filters.memberId;
        }
        return where;
    },

    findAll(filters: ListFilters = {}) {
        return Transaction.findAll({
            where: this.buildWhere(filters),
            include: [{
                model: Member,
                as: 'member',
                attributes: ['id', 'nom', 'prenom'],
                required: false,
            }],
            order: [['date', 'DESC']],
        });
    },

    create(values: Partial<Transaction['_creationAttributes']>, t?: SequelizeTransaction) {
        return Transaction.create(values as any, { transaction: t });
    },
};
