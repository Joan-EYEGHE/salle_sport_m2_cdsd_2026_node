"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BatchController = void 0;
const batch_service_1 = require("../services/batch.service");
exports.BatchController = {
    async list(req, res, next) {
        try {
            const data = await batch_service_1.BatchService.list();
            res.json({ success: true, data });
        }
        catch (error) {
            next(error);
        }
    },
    async getById(req, res, next) {
        try {
            const data = await batch_service_1.BatchService.getById(Number(req.params.id));
            res.json({ success: true, data });
        }
        catch (error) {
            next(error);
        }
    },
    async generate(req, res, next) {
        try {
            const data = await batch_service_1.BatchService.generate(req.body);
            res.status(201).json({ success: true, data });
        }
        catch (error) {
            next(error);
        }
    },
};
