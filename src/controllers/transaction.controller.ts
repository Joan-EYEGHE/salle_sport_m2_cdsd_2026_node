import { NextFunction, Request, Response } from "express";
import { TransactionService, toCSV } from "../services/transaction.service";

export const TransactionController = {
    async list(req: Request, res: Response, next: NextFunction) {
        try {
            const data = await TransactionService.list(req.query as any);
            res.json({ success: true, data });
        } catch (error) {
            next(error);
        }
    },

    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const data = await TransactionService.createManual(req.body);
            res.status(201).json({ success: true, data });
        } catch (error) {
            next(error);
        }
    },

    async summary(req: Request, res: Response, next: NextFunction) {
        try {
            const data = await TransactionService.summary(req.query as any);
            res.json({ success: true, data });
        } catch (error) {
            next(error);
        }
    },

    async exportCsv(req: Request, res: Response, next: NextFunction) {
        try {
            const rows = await TransactionService.listForExport(req.query as any);
            const csv = toCSV(rows);
            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', 'attachment; filename="transactions.csv"');
            res.send(csv);
        } catch (error) {
            next(error);
        }
    },
};
