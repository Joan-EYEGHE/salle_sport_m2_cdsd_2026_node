"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initAccessLogModel = exports.AccessLog = void 0;
const sequelize_1 = require("sequelize");
class AccessLog extends sequelize_1.Model {
}
exports.AccessLog = AccessLog;
const initAccessLogModel = (sequelize) => {
    AccessLog.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        id_ticket: {
            type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
            allowNull: true,
        },
        id_membre: {
            type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
            allowNull: true,
            references: { model: 'members', key: 'id' },
        },
        date_scan: {
            type: sequelize_1.DataTypes.DATE,
            defaultValue: sequelize_1.DataTypes.NOW,
        },
        resultat: {
            type: sequelize_1.DataTypes.ENUM('SUCCES', 'ECHEC'),
            allowNull: false,
        },
        id_controller: {
            type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            references: { model: 'users', key: 'id' },
        },
        active: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
    }, {
        sequelize,
        tableName: 'access_logs',
        timestamps: true,
        defaultScope: {
            where: { active: true },
        },
    });
};
exports.initAccessLogModel = initAccessLogModel;
