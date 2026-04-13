import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, Sequelize } from "sequelize";

export type TicketStatus = 'DISPONIBLE' | 'VENDU' | 'UTILISE' | 'EXPIRE';

export class Ticket extends Model<InferAttributes<Ticket>, InferCreationAttributes<Ticket>> {
    declare id: CreationOptional<number>;
    declare id_batch: number;
    declare id_membre: CreationOptional<number | null>;
    declare qr_code: CreationOptional<string>;
    declare code_ticket: string;
    declare status: CreationOptional<TicketStatus>;
    declare date_expiration: Date;
    declare prix_unitaire: number;
    declare readonly createdAt?: CreationOptional<Date>;
    declare readonly updatedAt?: CreationOptional<Date>;
}

export const initTicketModel = (sequelize: Sequelize) => {
    Ticket.init({
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        id_batch: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            references: { model: 'batches', key: 'id' },
        },
        id_membre: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: true,
            // Colonne physique en base (souvent member_id) — l’attribut Sequelize reste id_membre
            field: 'member_id',
            references: { model: 'members', key: 'id' },
        },
        qr_code: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            defaultValue: DataTypes.UUIDV4,
        },
        code_ticket: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        status: {
            type: DataTypes.ENUM('DISPONIBLE', 'VENDU', 'UTILISE', 'EXPIRE'),
            allowNull: false,
            defaultValue: 'DISPONIBLE',
        },
        date_expiration: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        prix_unitaire: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
    }, {
        sequelize,
        tableName: 'tickets',
        timestamps: true,
    });
};
