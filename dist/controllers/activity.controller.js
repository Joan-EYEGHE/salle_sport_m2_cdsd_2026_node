"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActivityController = void 0;
const activity_service_1 = require("../services/activity.service");
exports.ActivityController = {
    async list(req, res, next) {
        try {
            const data = await activity_service_1.ActivityService.list(req.query);
            res.json({ success: true, data });
        }
        catch (error) {
            next(error);
        }
    },
    async getById(req, res, next) {
        try {
            const data = await activity_service_1.ActivityService.getById(Number(req.params.id));
            res.json({ success: true, data });
        }
        catch (error) {
            next(error);
        }
    },
    async create(req, res, next) {
        try {
            const data = await activity_service_1.ActivityService.create(req.body);
            res.status(201).json({ success: true, data });
        }
        catch (error) {
            next(error);
        }
    },
    async update(req, res, next) {
        try {
            const data = await activity_service_1.ActivityService.update(Number(req.params.id), req.body);
            res.json({ success: true, data });
        }
        catch (error) {
            next(error);
        }
    },
    async softDelete(req, res, next) {
        try {
            const data = await activity_service_1.ActivityService.softDelete(Number(req.params.id));
            res.json({ success: true, data });
        }
        catch (error) {
            next(error);
        }
    },
};
