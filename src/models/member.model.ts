import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, Sequelize } from "sequelize";
import slugify from 'slugify';
import { randomUUID } from 'crypto';

function generateSlug(prenom: string, nom: string): string {
    const base = slugify(`${prenom} ${nom}`, { lower: true, strict: true });
    const suffix = randomUUID().replace(/-/g, '').substring(0, 4);
    return `${base}-${suffix}`;
}

export class Member extends Model<InferAttributes<Member>, InferCreationAttributes<Member>> {
    declare id: CreationOptional<number>;
    declare nom: string;
    declare prenom: string;
    declare slug: CreationOptional<string>;
    declare email: CreationOptional<string | null>;
    declare phone: CreationOptional<string | null>;
    declare date_naissance: CreationOptional<string | null>;
    declare adresse: CreationOptional<string | null>;
    declare uuid_qr: CreationOptional<string>;
    declare readonly createdAt?: CreationOptional<Date>;
    declare readonly updatedAt?: CreationOptional<Date>;
}

export const initMemberModel = (sequelize: Sequelize) => {
    Member.init({
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        nom: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        prenom: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        slug: {
            type: DataTypes.STRING,
            allowNull: true,
            unique: true,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: true,
            unique: true,
        },
        phone: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        date_naissance: {
            type: DataTypes.DATEONLY,
            allowNull: true,
        },
        adresse: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        uuid_qr: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            defaultValue: DataTypes.UUIDV4,
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
