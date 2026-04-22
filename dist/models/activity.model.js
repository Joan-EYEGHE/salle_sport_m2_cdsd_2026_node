"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initActivityModel = exports.Activity = void 0;
exports.generateActivitySlug = generateActivitySlug;
const sequelize_1 = require("sequelize");
const slugify_1 = __importDefault(require("slugify"));
const crypto_1 = require("crypto");
/** Exporté pour backfill côté service (lignes sans slug) — même logique que les hooks. */
function generateActivitySlug(nom) {
    const base = (0, slugify_1.default)(nom, { lower: true, strict: true });
    const suffix = (0, crypto_1.randomUUID)().replace(/-/g, '').substring(0, 4);
    return `${base}-${suffix}`;
}
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
        slug: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true,
            unique: true,
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
        hooks: {
            beforeCreate(activity) {
                if (!activity.slug) {
                    activity.slug = generateActivitySlug(activity.nom);
                }
            },
            beforeUpdate(activity) {
                if (activity.changed('nom')) {
                    activity.slug = generateActivitySlug(activity.nom);
                }
            },
        },
    });
};
exports.initActivityModel = initActivityModel;
