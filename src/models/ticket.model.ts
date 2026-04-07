import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, Sequelize } from "sequelize";
import { TicketStatus } from "../utils/interfaces";

export class Ticket extends Model<InferAttributes<Ticket>, InferCreationAttributes<Ticket>> {
    declare id: CreationOptional<number>;
    declare id_batch: number;
    declare qr_code: CreationOptional<string>;
    declare status: CreationOptional<TicketStatus>;
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
        qr_code: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            defaultValue: DataTypes.UUIDV4,
        },
        status: {
            type: DataTypes.ENUM('VALID', 'USED', 'EXPIRED'),
            allowNull: false,
            defaultValue: 'VALID',
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
