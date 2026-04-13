"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const models_1 = require("../models");
const jwt_1 = require("../utils/jwt");
const password_1 = require("../utils/password");
exports.AuthService = {
    async login(email, password) {
        const user = await models_1.User.findOne({ where: { email } });
        if (!user) {
            throw Object.assign(new Error('Invalid credentials!'), { status: 401 });
        }
        const isMatch = await (0, password_1.comparePassword)(password, user.passwordHash);
        if (!isMatch) {
            throw Object.assign(new Error('Invalid credentials!'), { status: 401 });
        }
        const token = (0, jwt_1.signToken)({ id: user.id, role: user.role });
        const refreshToken = (0, jwt_1.signRefreshToken)({ id: user.id, role: user.role });
        return {
            token,
            refreshToken,
            user: {
                id: user.id,
                fullName: user.fullName,
                email: user.email,
                role: user.role,
                firstConnection: user.firstConnection,
            },
        };
    },
    async refresh(refreshToken) {
        let decoded;
        try {
            decoded = (0, jwt_1.verifyRefreshToken)(refreshToken);
        }
        catch {
            throw Object.assign(new Error('Invalid or expired refresh token'), { status: 401 });
        }
        const user = await models_1.User.findByPk(decoded.id);
        if (!user || !user.isActive) {
            throw Object.assign(new Error('User not found or inactive'), { status: 401 });
        }
        const newToken = (0, jwt_1.signToken)({ id: user.id, role: user.role });
        const newRefreshToken = (0, jwt_1.signRefreshToken)({ id: user.id, role: user.role });
        return {
            token: newToken,
            refreshToken: newRefreshToken,
            user: {
                id: user.id,
                fullName: user.fullName,
                email: user.email,
                role: user.role,
                firstConnection: user.firstConnection,
            },
        };
    },
};
