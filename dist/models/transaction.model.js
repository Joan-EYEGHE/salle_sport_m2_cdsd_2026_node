"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initTransactionModel = exports.Transaction = void 0;
const sequelize_1 = require("sequelize");
class Transaction extends sequelize_1.Model {
}
exports.Transaction = Transaction;
const initTransactionModel = (sequelize) => {
    Transaction.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        montant: {
            type: sequelize_1.DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        type: {
            type: sequelize_1.DataTypes.ENUM('REVENU', 'DEPENSE'),
            allowNull: false,
        },
        methode_paiement: {
            type: sequelize_1.DataTypes.ENUM('CASH', 'WAVE', 'ORANGE'),
            allowNull: true,
            defaultValue: 'CASH',
        },
        libelle: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        date: {
            type: sequelize_1.DataTypes.DATE,
            defaultValue: sequelize_1.DataTypes.NOW,
        },
        id_membre: {
            type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
            allowNull: true,
            references: { model: 'members', key: 'id' },
        },
        active: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
    }, {
        sequelize,
        tableName: 'transactions',
        timestamps: true,
        defaultScope: {
            where: { active: true },
        },
    });
};
exports.initTransactionModel = initTransactionModel;
