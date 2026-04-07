import { WhereOptions } from "sequelize";
import { Activity } from "../models";

export const ActivityData = {
    findAll(where: WhereOptions<Activity> = {}) {
        return Activity.findAll({ where, order: [['nom', 'ASC']] });
    },

    findByPk(id: number) {
        return Activity.findByPk(id);
    },

    create(values: Partial<Activity['_creationAttributes']>) {
        return Activity.create(values as any);
    },

    update(id: number, values: Partial<Activity['_creationAttributes']>) {
        return Activity.update(values as any, { where: { id } });
    },
};
