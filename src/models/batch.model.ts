import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, Sequelize } from "sequelize";

export class Batch extends Model<InferAttributes<Batch>, InferCreationAttributes<Batch>> {
    declare id: CreationOptional<number>;
    declare id_activity: number;
    declare quantite: number;
    declare prix_unitaire_applique: number;
    declare active: CreationOptional<boolean>;
    declare readonly createdAt?: CreationOptional<Date>;
    declare readonly updatedAt?: CreationOptional<Date>;
}

export const initBatchModel = (sequelize: Sequelize) => {
    Batch.init({
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        id_activity: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            references: { model: 'activities', key: 'id' },
        },
        quantite: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        prix_unitaire_applique: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        active: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
    }, {
        sequelize,
        tableName: 'batches',
        timestamps: true,
        defaultScope: {
            where: { active: true },
        },
    });
};
