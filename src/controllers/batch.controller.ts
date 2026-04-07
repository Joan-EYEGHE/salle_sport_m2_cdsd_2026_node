import { NextFunction, Request, Response } from "express";
import { BatchService } from "../services/batch.service";

export const BatchController = {
    async list(req: Request, res: Response, next: NextFunction) {
        try {
            const data = await BatchService.list();
            res.json({ success: true, data });
        } catch (error) {
            next(error);
        }
    },

    async getById(req: Request, res: Response, next: NextFunction) {
        try {
            const data = await BatchService.getById(Number(req.params.id));
            res.json({ success: true, data });
        } catch (error) {
            next(error);
        }
    },

    async generate(req: Request, res: Response, next: NextFunction) {
        try {
            const data = await BatchService.generate(req.body);
            res.status(201).json({ success: true, data });
        } catch (error) {
            next(error);
        }
    },
};
