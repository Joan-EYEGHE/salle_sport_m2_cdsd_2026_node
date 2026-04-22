import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, Sequelize } from "sequelize";
import slugify from 'slugify';
import { randomUUID } from 'crypto';

function generateActivitySlug(nom: string): string {
    const base = slugify(nom, { lower: true, strict: true });
    const suffix = randomUUID().replace(/-/g, '').substring(0, 4);
    return `${base}-${suffix}`;
}

export class Activity extends Model<InferAttributes<Activity>, InferCreationAttributes<Activity>> {
    declare id: CreationOptional<number>;
    declare nom: string;
    declare slug: CreationOptional<string>;
    declare status: CreationOptional<boolean>;
    declare frais_inscription: CreationOptional<number>;
    declare prix_ticket: CreationOptional<number>;
    declare prix_hebdomadaire: CreationOptional<number>;
    declare prix_mensuel: CreationOptional<number>;
    declare prix_trimestriel: CreationOptional<number>;
    declare prix_annuel: CreationOptional<number>;
    declare isMonthlyOnly: CreationOptional<boolean>;
    declare active: CreationOptional<boolean>;
    declare readonly createdAt?: CreationOptional<Date>;
    declare readonly updatedAt?: CreationOptional<Date>;
}

export const initActivityModel = (sequelize: Sequelize) => {
    Activity.init({
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        nom: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        slug: {
            type: DataTypes.STRING,
            allowNull: true,
            unique: true,
        },
        status: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
        frais_inscription: {
            type: DataTypes.DECIMAL(10, 2),
            defaultValue: 0,
        },
        prix_ticket: {
            type: DataTypes.DECIMAL(10, 2),
            defaultValue: 0,
        },
        prix_hebdomadaire: {
            type: DataTypes.DECIMAL(10, 2),
            defaultValue: 0,
        },
        prix_mensuel: {
            type: DataTypes.DECIMAL(10, 2),
            defaultValue: 0,
        },
        prix_trimestriel: {
            type: DataTypes.DECIMAL(10, 2),
            defaultValue: 0,
        },
        prix_annuel: {
            type: DataTypes.DECIMAL(10, 2),
            defaultValue: 0,
        },
        isMonthlyOnly: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        active: {
            type: DataTypes.BOOLEAN,
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
