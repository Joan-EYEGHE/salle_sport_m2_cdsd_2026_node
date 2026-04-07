import { NextFunction, Request, Response } from "express";
import { AccessLogService, toCSV } from "../services/accesslog.service";

export const AccessLogController = {
    async list(req: Request, res: Response, next: NextFunction) {
        try {
            const data = await AccessLogService.list(req.query as any);
            res.json({ success: true, data });
        } catch (error) {
            next(error);
        }
    },

    async stats(req: Request, res: Response, next: NextFunction) {
        try {
            const data = await AccessLogService.stats(req.query as any);
            res.json({ success: true, data });
        } catch (error) {
            next(error);
        }
    },

    async exportCsv(req: Request, res: Response, next: NextFunction) {
        try {
            const rows = await AccessLogService.listForExport(req.query as any);
            const csv = toCSV(rows);
            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', 'attachment; filename="access_logs.csv"');
            res.send(csv);
        } catch (error) {
            next(error);
        }
    },
};
