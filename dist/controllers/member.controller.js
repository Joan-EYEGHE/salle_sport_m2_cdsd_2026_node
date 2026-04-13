"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemberController = void 0;
const member_service_1 = require("../services/member.service");
exports.MemberController = {
    async list(req, res, next) {
        try {
            const data = await member_service_1.MemberService.list();
            res.json({ success: true, data });
        }
        catch (error) {
            next(error);
        }
    },
    async create(req, res, next) {
        try {
            const data = await member_service_1.MemberService.create(req.body);
            res.status(201).json({ success: true, data });
        }
        catch (error) {
            next(error);
        }
    },
    async getById(req, res, next) {
        try {
            const data = await member_service_1.MemberService.getById(req.params.id);
            res.json({ success: true, data });
        }
        catch (error) {
            next(error);
        }
    },
    async findByQr(req, res, next) {
        try {
            const data = await member_service_1.MemberService.findByQr(req.params.uuid);
            res.json({ success: true, data });
        }
        catch (error) {
            next(error);
        }
    },
    async update(req, res, next) {
        try {
            const data = await member_service_1.MemberService.update(req.params.id, req.body);
            res.json({ success: true, data });
        }
        catch (error) {
            next(error);
        }
    },
    async subscribe(req, res, next) {
        try {
            const data = await member_service_1.MemberService.subscribe(req.body);
            res.status(201).json({ success: true, data });
        }
        catch (error) {
            next(error);
        }
    },
    async remove(req, res, next) {
        try {
            const id = Number(req.params.id);
            if (!Number.isFinite(id)) {
                res.status(400).json({ success: false, message: 'Invalid id' });
                return;
            }
            await member_service_1.MemberService.softDelete(id);
            res.json({ success: true, message: 'Supprimé avec succès' });
        }
        catch (error) {
            next(error);
        }
    },
};
