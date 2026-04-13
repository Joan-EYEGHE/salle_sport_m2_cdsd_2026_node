"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initSubscriptionModel = exports.Subscription = void 0;
const sequelize_1 = require("sequelize");
class Subscription extends sequelize_1.Model {
}
exports.Subscription = Subscription;
const initSubscriptionModel = (sequelize) => {
    Subscription.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        id_membre: {
            type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            references: { model: 'members', key: 'id' },
        },
        id_activity: {
            type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            references: { model: 'activities', key: 'id' },
        },
        type_forfait: {
            type: sequelize_1.DataTypes.ENUM('HEBDO', 'MENSUEL', 'TRIMESTRIEL', 'ANNUEL'),
            allowNull: false,
        },
        frais_inscription_payes: {
            type: sequelize_1.DataTypes.DECIMAL(10, 2),
            defaultValue: 0,
        },
        frais_uniquement: {
            type: sequelize_1.DataTypes.BOOLEAN,
            defaultValue: false,
        },
        montant_total: {
            type: sequelize_1.DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        date_debut: {
            type: sequelize_1.DataTypes.DATEONLY,
            allowNull: false,
        },
        date_prochain_paiement: {
            type: sequelize_1.DataTypes.DATEONLY,
            allowNull: false,
        },
    }, {
        sequelize,
        tableName: 'subscriptions',
        timestamps: true,
    });
};
exports.initSubscriptionModel = initSubscriptionModel;
