import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, Sequelize } from "sequelize";

export class Activity extends Model<InferAttributes<Activity>, InferCreationAttributes<Activity>> {
    declare id: CreationOptional<number>;
    declare nom: string;
    declare status: CreationOptional<boolean>;
    declare frais_inscription: CreationOptional<number>;
    declare prix_ticket: CreationOptional<number>;
    declare prix_hebdomadaire: CreationOptional<number>;
    declare prix_mensuel: CreationOptional<number>;
    declare prix_trimestriel: CreationOptional<number>;
    declare prix_annuel: CreationOptional<number>;
    declare isMonthlyOnly: CreationOptional<boolean>;
    declare readonly createdAt?: CreationOptional<Date>;
    declare readonly updatedAt?: CreationOptional<Date>;
}

export const initActivityModel = (sequelize: Sequelize) => {
    Activity.init({
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        nom: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        status: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
        frais_inscription: {
            type: DataTypes.DECIMAL(10, 2),
            defaultValue: 0,
        },
        prix_ticket: {
            type: DataTypes.DECIMAL(10, 2),
            defaultValue: 0,
        },
        prix_hebdomadaire: {
            type: DataTypes.DECIMAL(10, 2),
            defaultValue: 0,
        },
        prix_mensuel: {
            type: DataTypes.DECIMAL(10, 2),
            defaultValue: 0,
        },
        prix_trimestriel: {
            type: DataTypes.DECIMAL(10, 2),
            defaultValue: 0,
        },
        prix_annuel: {
            type: DataTypes.DECIMAL(10, 2),
            defaultValue: 0,
        },
        isMonthlyOnly: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
    }, {
        sequelize,
        tableName: 'activities',
        timestamps: true,
    });
};
