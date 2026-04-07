import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, Sequelize } from "sequelize";

export type TypeForfait = 'HEBDO' | 'MENSUEL' | 'TRIMESTRIEL' | 'ANNUEL';

export class Subscription extends Model<InferAttributes<Subscription>, InferCreationAttributes<Subscription>> {
    declare id: CreationOptional<number>;
    declare id_membre: number;
    declare id_activity: number;
    declare type_forfait: TypeForfait;
    declare frais_inscription_payes: CreationOptional<number>;
    declare frais_uniquement: CreationOptional<boolean>;
    declare montant_total: number;
    declare date_debut: string;
    declare date_prochain_paiement: string;
    declare readonly createdAt?: CreationOptional<Date>;
    declare readonly updatedAt?: CreationOptional<Date>;
}

export const initSubscriptionModel = (sequelize: Sequelize) => {
    Subscription.init({
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        id_membre: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            references: { model: 'members', key: 'id' },
        },
        id_activity: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            references: { model: 'activities', key: 'id' },
        },
        type_forfait: {
            type: DataTypes.ENUM('HEBDO', 'MENSUEL', 'TRIMESTRIEL', 'ANNUEL'),
            allowNull: false,
        },
        frais_inscription_payes: {
            type: DataTypes.DECIMAL(10, 2),
            defaultValue: 0,
        },
        frais_uniquement: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        montant_total: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        date_debut: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        date_prochain_paiement: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
    }, {
        sequelize,
        tableName: 'subscriptions',
        timestamps: true,
    });
};
