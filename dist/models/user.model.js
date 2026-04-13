"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initUserModel = exports.User = void 0;
const sequelize_1 = require("sequelize");
class User extends sequelize_1.Model {
}
exports.User = User;
const initUserModel = (sequelize) => {
    User.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true
        },
        fullName: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        passwordHash: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        role: {
            type: sequelize_1.DataTypes.ENUM("ADMIN", "CASHIER", "CONTROLLER"),
            allowNull: false,
            defaultValue: 'CASHIER'
        },
        isActive: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
        firstConnection: {
            type: sequelize_1.DataTypes.BOOLEAN,
            defaultValue: true,
        },
    }, {
        sequelize,
        tableName: 'users',
        timestamps: true,
    });
};
exports.initUserModel = initUserModel;
