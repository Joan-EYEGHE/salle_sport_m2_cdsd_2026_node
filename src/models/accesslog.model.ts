import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, Sequelize } from "sequelize";

export type ResultatScan = 'SUCCES' | 'ECHEC';

export class AccessLog extends Model<InferAttributes<AccessLog>, InferCreationAttributes<AccessLog>> {
    declare id: CreationOptional<number>;
    declare id_ticket: number;
    declare date_scan: CreationOptional<Date>;
    declare resultat: ResultatScan;
    declare id_controller: number;
    declare readonly createdAt?: CreationOptional<Date>;
    declare readonly updatedAt?: CreationOptional<Date>;
}

export const initAccessLogModel = (sequelize: Sequelize) => {
    AccessLog.init({
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        id_ticket: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
        },
        date_scan: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
        resultat: {
            type: DataTypes.ENUM('SUCCES', 'ECHEC'),
            allowNull: false,
        },
        id_controller: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            references: { model: 'users', key: 'id' },
        },
    }, {
        sequelize,
        tableName: 'access_logs',
        timestamps: true,
    });
};
