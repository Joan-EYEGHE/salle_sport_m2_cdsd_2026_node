import { NextFunction, Request, Response } from "express";
import { ActivityService } from "../services/activity.service";

export const ActivityController = {
    async list(req: Request, res: Response, next: NextFunction) {
        try {
            const data = await ActivityService.list(req.query as any);
            res.json({ success: true, data });
        } catch (error) {
            next(error);
        }
    },

    async getById(req: Request, res: Response, next: NextFunction) {
        try {
            const data = await ActivityService.getById(Number(req.params.id));
            res.json({ success: true, data });
        } catch (error) {
            next(error);
        }
    },

    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const data = await ActivityService.create(req.body);
            res.status(201).json({ success: true, data });
        } catch (error) {
            next(error);
        }
    },

    async update(req: Request, res: Response, next: NextFunction) {
        try {
            const data = await ActivityService.update(Number(req.params.id), req.body);
            res.json({ success: true, data });
        } catch (error) {
            next(error);
        }
    },

    async softDelete(req: Request, res: Response, next: NextFunction) {
        try {
            const data = await ActivityService.softDelete(Number(req.params.id));
            res.json({ success: true, data });
        } catch (error) {
            next(error);
        }
    },
};
