import { Op, Transaction as SequelizeTransaction, WhereOptions } from "sequelize";
import { Activity, Batch, Ticket } from "../models";

export const TicketData = {
    findAll(filters: { status?: string; batch_id?: number } = {}) {
        const where: WhereOptions = {};
        if (filters.status) (where as any).status = filters.status;
        if (filters.batch_id) (where as any).id_batch = filters.batch_id;
        return Ticket.findAll({
            where,
            include: [{ model: Batch, include: [{ model: Activity, attributes: ['id', 'nom'] }] }],
            order: [['createdAt', 'DESC']],
        });
    },

    findByPk(id: number) {
        return Ticket.findByPk(id, {
            include: [{ model: Batch, include: [{ model: Activity, attributes: ['id', 'nom'] }] }],
        });
    },

    findByCode(code: string) {
        return Ticket.findOne({
            where: {
                [Op.or]: [
                    { qr_code: code },
                    { code_ticket: code },
                ],
            },
        });
    },

    update(id: number, values: Partial<Ticket['_creationAttributes']>, t?: SequelizeTransaction) {
        return Ticket.update(values as any, { where: { id }, transaction: t });
    },
};
