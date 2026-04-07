import { Transaction as SequelizeTransaction } from "sequelize";
import { Activity, Batch, Ticket } from "../models";

export const BatchData = {
    findAll() {
        return Batch.findAll({
            include: [
                { model: Activity, attributes: ['id', 'nom'] },
                { model: Ticket, attributes: ['id', 'status'] },
            ],
            order: [['createdAt', 'DESC']],
        });
    },

    findByPk(id: number) {
        return Batch.findByPk(id, {
            include: [
                { model: Activity, attributes: ['id', 'nom', 'prix_ticket'] },
                { model: Ticket },
            ],
        });
    },

    create(values: Partial<Batch['_creationAttributes']>, t?: SequelizeTransaction) {
        return Batch.create(values as any, { transaction: t });
    },
};
