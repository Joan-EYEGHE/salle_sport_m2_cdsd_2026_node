"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const auth_service_1 = require("../services/auth.service");
const models_1 = require("../models");
exports.AuthController = {
    async login(req, res, next) {
        try {
            const { email, password } = req.body;
            const result = await auth_service_1.AuthService.login(email, password);
            return res.json({ success: true, data: result });
        }
        catch (error) {
            next(error);
        }
    },
    logout(_req, res, _next) {
        res.json({ success: true, message: 'Logged out' });
    },
    async refresh(req, res, next) {
        try {
            const { token, refreshToken } = req.body;
            const rt = refreshToken ?? token;
            if (!rt) {
                return res.status(400).json({ success: false, message: 'refreshToken is required' });
            }
            const result = await auth_service_1.AuthService.refresh(rt);
            return res.json({ success: true, data: result });
        }
        catch (error) {
            next(error);
        }
    },
    async me(req, res, next) {
        try {
            if (!req.user?.id) {
                return res.status(401).json({ success: false, message: 'Unauthorized' });
            }
            const user = await models_1.User.findByPk(req.user.id, {
                attributes: ['id', 'email', 'role', 'fullName', 'active', 'firstConnection'],
            });
            if (!user || !user.active) {
                return res.status(401).json({ success: false, message: 'Unauthorized' });
            }
            return res.json({ success: true, data: user });
        }
        catch (error) {
            next(error);
        }
    },
};
