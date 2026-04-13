"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionController = void 0;
const subscription_service_1 = require("../services/subscription.service");
exports.SubscriptionController = {
    async create(req, res, next) {
        try {
            const body = req.body;
            const data = await subscription_service_1.SubscriptionService.create(body);
            res.status(201).json({ success: true, data });
        }
        catch (error) {
            next(error);
        }
    },
    async list(req, res, next) {
        try {
            if (req.query.renewed === "true") {
                res.json({ success: true, data: { count: 0 } });
                return;
            }
            const memberId = req.query.memberId != null ? Number(req.query.memberId) : undefined;
            const activityId = req.query.activityId != null ? Number(req.query.activityId) : undefined;
            const status = typeof req.query.status === "string" ? req.query.status : undefined;
            const data = await subscription_service_1.SubscriptionService.list({
                memberId: Number.isFinite(memberId) ? memberId : undefined,
                activityId: Number.isFinite(activityId) ? activityId : undefined,
                status,
            });
            res.json({ success: true, data });
        }
        catch (error) {
            next(error);
        }
    },
    async expiringSoon(req, res, next) {
        try {
            const days = Math.min(365, Math.max(1, Number(req.query.days) || 30));
            const rows = await subscription_service_1.SubscriptionService.expiringSoon(days);
            res.json({ success: true, data: rows, count: rows.length });
        }
        catch (error) {
            next(error);
        }
    },
    async getById(req, res, next) {
        try {
            const id = Number(req.params.id);
            if (!Number.isFinite(id)) {
                res.status(400).json({ success: false, message: "Invalid id" });
                return;
            }
            const data = await subscription_service_1.SubscriptionService.getById(id);
            res.json({ success: true, data });
        }
        catch (error) {
            next(error);
        }
    },
    async remove(req, res, next) {
        try {
            const id = Number(req.params.id);
            if (!Number.isFinite(id)) {
                res.status(400).json({ success: false, message: "Invalid id" });
                return;
            }
            await subscription_service_1.SubscriptionService.remove(id);
            res.json({ success: true, message: "Supprimé avec succès" });
        }
        catch (error) {
            next(error);
        }
    },
};
