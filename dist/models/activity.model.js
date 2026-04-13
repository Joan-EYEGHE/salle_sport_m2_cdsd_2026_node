"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initActivityModel = exports.Activity = void 0;
const sequelize_1 = require("sequelize");
class Activity extends sequelize_1.Model {
}
exports.Activity = Activity;
const initActivityModel = (sequelize) => {
    Activity.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        nom: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        status: {
            type: sequelize_1.DataTypes.BOOLEAN,
            defaultValue: true,
        },
        frais_inscription: {
            type: sequelize_1.DataTypes.DECIMAL(10, 2),
            defaultValue: 0,
        },
        prix_ticket: {
            type: sequelize_1.DataTypes.DECIMAL(10, 2),
            defaultValue: 0,
        },
        prix_hebdomadaire: {
            type: sequelize_1.DataTypes.DECIMAL(10, 2),
            defaultValue: 0,
        },
        prix_mensuel: {
            type: sequelize_1.DataTypes.DECIMAL(10, 2),
            defaultValue: 0,
        },
        prix_trimestriel: {
            type: sequelize_1.DataTypes.DECIMAL(10, 2),
            defaultValue: 0,
        },
        prix_annuel: {
            type: sequelize_1.DataTypes.DECIMAL(10, 2),
            defaultValue: 0,
        },
        isMonthlyOnly: {
            type: sequelize_1.DataTypes.BOOLEAN,
            defaultValue: false,
        },
        active: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
    }, {
        sequelize,
        tableName: 'activities',
        timestamps: true,
        defaultScope: {
            where: { active: true },
        },
    });
};
exports.initActivityModel = initActivityModel;
