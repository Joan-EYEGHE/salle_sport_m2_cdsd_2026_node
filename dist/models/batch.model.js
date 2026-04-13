"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initBatchModel = exports.Batch = void 0;
const sequelize_1 = require("sequelize");
class Batch extends sequelize_1.Model {
}
exports.Batch = Batch;
const initBatchModel = (sequelize) => {
    Batch.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        id_activity: {
            type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            references: { model: 'activities', key: 'id' },
        },
        quantite: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
        },
        prix_unitaire_applique: {
            type: sequelize_1.DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
    }, {
        sequelize,
        tableName: 'batches',
        timestamps: true,
    });
};
exports.initBatchModel = initBatchModel;
