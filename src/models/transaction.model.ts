import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, Sequelize } from "sequelize";

export type TypeTransaction = 'REVENU' | 'DEPENSE';
export type MethodePaiement = 'CASH' | 'WAVE' | 'ORANGE';

export class Transaction extends Model<InferAttributes<Transaction>, InferCreationAttributes<Transaction>> {
    declare id: CreationOptional<number>;
    declare montant: number;
    declare type: TypeTransaction;
    declare methode_paiement: CreationOptional<MethodePaiement | null>;
    declare libelle: string;
    declare date: CreationOptional<Date>;
    declare id_membre: CreationOptional<number | null>;
    declare active: CreationOptional<boolean>;
    declare readonly createdAt?: CreationOptional<Date>;
    declare readonly updatedAt?: CreationOptional<Date>;
}

export const initTransactionModel = (sequelize: Sequelize) => {
    Transaction.init({
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        montant: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        type: {
            type: DataTypes.ENUM('REVENU', 'DEPENSE'),
            allowNull: false,
        },
        methode_paiement: {
            type: DataTypes.ENUM('CASH', 'WAVE', 'ORANGE'),
            allowNull: true,
            defaultValue: 'CASH',
        },
        libelle: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        date: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
        id_membre: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: true,
            references: { model: 'members', key: 'id' },
        },
        active: {
            type: DataTypes.BOOLEAN,
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
