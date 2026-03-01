import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, Optional, Sequelize } from "sequelize";
import { Role as UserRole } from "../utils/interfaces";


export class User extends Model<InferAttributes<User>, InferCreationAttributes<User>>{
    declare id: CreationOptional<number>;
    declare fullName: string;
    declare email: string;
    declare passwordHash: string;
    declare role: UserRole;
    declare isActive: boolean;
    declare readonly createdAt?: CreationOptional<Date>;
    declare readonly updatedAt?: CreationOptional<Date>;
    declare firstConnection: boolean;
}

export const initUserModel = (sequelize: Sequelize) => {
    User.init({
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true
        },
        fullName:{
            type: DataTypes.STRING,
            allowNull: false
        },
        email:{
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        passwordHash:{
            type: DataTypes.STRING,
            allowNull: false,
        },
        role:{
            type: DataTypes.ENUM("ADMIN" , "CASHIER" , "CONTROLLER"),
            allowNull:false,
            defaultValue: 'CASHIER'
        },
        isActive:{
            type: DataTypes.BOOLEAN,
            allowNull:false,
            defaultValue: true,
        },
        firstConnection:{
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
    },{
        sequelize,
        tableName: 'users',
        timestamps: true,
    })
}
