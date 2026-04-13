import { NextFunction, Request, Response } from "express";
import { CreateSubscriptionInput, SubscriptionService } from "../services/subscription.service";
import { AuthenticatedRequest } from "../utils/interfaces";

export const SubscriptionController = {
    async create(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        try {
            const body = req.body as CreateSubscriptionInput;
            const data = await SubscriptionService.create(body);
            res.status(201).json({ success: true, data });
        } catch (error) {
            next(error);
        }
    },

    async list(req: Request, res: Response, next: NextFunction) {
        try {
            if (req.query.renewed === "true") {
                res.json({ success: true, data: { count: 0 } });
                return;
            }

            const memberId = req.query.memberId != null ? Number(req.query.memberId) : undefined;
            const activityId = req.query.activityId != null ? Number(req.query.activityId) : undefined;
            const status = typeof req.query.status === "string" ? req.query.status : undefined;

            const data = await SubscriptionService.list({
                memberId: Number.isFinite(memberId) ? memberId : undefined,
                activityId: Number.isFinite(activityId) ? activityId : undefined,
                status,
            });
            res.json({ success: true, data });
        } catch (error) {
            next(error);
        }
    },

    async expiringSoon(req: Request, res: Response, next: NextFunction) {
        try {
            const days = Math.min(365, Math.max(1, Number(req.query.days) || 30));
            const rows = await SubscriptionService.expiringSoon(days);
            res.json({ success: true, data: rows, count: rows.length });
        } catch (error) {
            next(error);
        }
    },

    async getById(req: Request, res: Response, next: NextFunction) {
        try {
            const id = Number(req.params.id);
            if (!Number.isFinite(id)) {
                res.status(400).json({ success: false, message: "Invalid id" });
                return;
            }
            const data = await SubscriptionService.getById(id);
            res.json({ success: true, data });
        } catch (error) {
            next(error);
        }
    },

    async remove(req: Request, res: Response, next: NextFunction) {
        try {
            const id = Number(req.params.id);
            if (!Number.isFinite(id)) {
                res.status(400).json({ success: false, message: "Invalid id" });
                return;
            }
            await SubscriptionService.remove(id);
            res.json({ success: true, message: "Supprimé avec succès" });
        } catch (error) {
            next(error);
        }
    },
};
