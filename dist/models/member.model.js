"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initMemberModel = exports.Member = void 0;
const sequelize_1 = require("sequelize");
const slugify_1 = __importDefault(require("slugify"));
const crypto_1 = require("crypto");
function generateSlug(prenom, nom) {
    const base = (0, slugify_1.default)(`${prenom} ${nom}`, { lower: true, strict: true });
    const suffix = (0, crypto_1.randomUUID)().replace(/-/g, '').substring(0, 4);
    return `${base}-${suffix}`;
}
class Member extends sequelize_1.Model {
}
exports.Member = Member;
const initMemberModel = (sequelize) => {
    Member.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        nom: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        prenom: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        slug: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true,
            unique: true,
        },
        email: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true,
            unique: true,
        },
        phone: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true,
        },
        date_naissance: {
            type: sequelize_1.DataTypes.DATEONLY,
            allowNull: true,
        },
        adresse: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true,
        },
        uuid_qr: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
            unique: true,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
        },
    }, {
        sequelize,
        tableName: 'members',
        timestamps: true,
        hooks: {
            beforeCreate(member) {
                if (!member.slug) {
                    member.slug = generateSlug(member.prenom, member.nom);
                }
            },
            beforeUpdate(member) {
                if (member.changed('nom') || member.changed('prenom')) {
                    member.slug = generateSlug(member.prenom, member.nom);
                }
            },
        },
    });
};
exports.initMemberModel = initMemberModel;
