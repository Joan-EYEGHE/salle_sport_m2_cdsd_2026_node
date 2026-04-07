import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, Sequelize } from "sequelize";

export class Member extends Model<InferAttributes<Member>, InferCreationAttributes<Member>> {
    declare id: CreationOptional<number>;
    declare nom: string;
    declare prenom: string;
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
    });
};
