"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initTicketModel = exports.Ticket = void 0;
const sequelize_1 = require("sequelize");
class Ticket extends sequelize_1.Model {
}
exports.Ticket = Ticket;
const initTicketModel = (sequelize) => {
    Ticket.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        id_batch: {
            type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            references: { model: 'batches', key: 'id' },
        },
        id_membre: {
            type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
            allowNull: true,
            // Colonne physique en base (souvent member_id) — l’attribut Sequelize reste id_membre
            field: 'member_id',
            references: { model: 'members', key: 'id' },
        },
        qr_code: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
            unique: true,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
        },
        code_ticket: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        status: {
            type: sequelize_1.DataTypes.ENUM('DISPONIBLE', 'VENDU', 'UTILISE', 'EXPIRE'),
            allowNull: false,
            defaultValue: 'DISPONIBLE',
        },
        date_expiration: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
        },
        prix_unitaire: {
            type: sequelize_1.DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
    }, {
        sequelize,
        tableName: 'tickets',
        timestamps: true,
    });
};
exports.initTicketModel = initTicketModel;
