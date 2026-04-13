"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const password_1 = require("./../utils/password");
const models_1 = require("../models");
const sequelize_1 = require("sequelize");
const normalizeEmail = (email) => email.trim().toLocaleLowerCase();
exports.UserService = {
    async list(query) {
        const page = query.page && query.page > 0 ? query.page : 1;
        const limit = query.limit && query.limit > 0 ? Math.min(query.limit, 100) : 20;
        const offset = (page - 1) * limit;
        const where = {};
        const includeInactive = query.includeInactive === 'true' || query.includeInactive === '1';
        if (!includeInactive) {
            where.isActive = true;
        }
        if (query.search && query.search.trim()) {
            const q = `%${query.search.trim()}%`;
            where[sequelize_1.Op.or] = [
                { fullName: { [sequelize_1.Op.like]: q } },
                { email: { [sequelize_1.Op.like]: q } }
            ];
        }
        const { rows, count } = await models_1.User.findAndCountAll({
            where,
            attributes: { exclude: ['passwordHash'] },
            limit,
            offset,
            order: [['fullName', 'ASC']]
        });
        return {
            items: rows,
            total: count,
            page,
            limit,
            totalPages: Math.ceil(count / limit)
        };
    },
    async create(input) {
        if (!input.fullName?.trim()) {
            throw Object.assign(new Error('FullName is required!'), { status: 400 });
        }
        if (!input.email?.trim()) {
            throw Object.assign(new Error('Email is required!'), { status: 400 });
        }
        if (!input.role?.trim()) {
            throw Object.assign(new Error('Role is required!'), { status: 400 });
        }
        (0, password_1.validatePassword)(input.password);
        const email = normalizeEmail(input.email);
        const exists = await models_1.User.findOne({ where: { email } });
        if (exists) {
            throw Object.assign(new Error('Email already exists!'), { status: 400 });
        }
        const hashed = await (0, password_1.hashPassword)(input.password);
        //
        const user = await models_1.User.create({
            fullName: input.fullName.trim(),
            email,
            passwordHash: hashed,
            role: input.role,
            firstConnection: false,
            isActive: true,
        });
        const safeUser = models_1.User.findByPk(user.id, { attributes: { exclude: ["passwordHash"] } });
        return safeUser;
    },
    // AUDIT FIX: méthode manquante appelée par router.param dans user.routes.ts
    async findById(id) {
        return models_1.User.findByPk(id, { attributes: { exclude: ['passwordHash'] } });
    },
};
