"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionController = void 0;
const transaction_service_1 = require("../services/transaction.service");
exports.TransactionController = {
    async list(req, res, next) {
        try {
            const data = await transaction_service_1.TransactionService.list(req.query);
            res.json({ success: true, data });
        }
        catch (error) {
            next(error);
        }
    },
    async create(req, res, next) {
        try {
            const data = await transaction_service_1.TransactionService.createManual(req.body);
            res.status(201).json({ success: true, data });
        }
        catch (error) {
            next(error);
        }
    },
    async summary(req, res, next) {
        try {
            const data = await transaction_service_1.TransactionService.summary(req.query);
            res.json({ success: true, data });
        }
        catch (error) {
            next(error);
        }
    },
    async exportCsv(req, res, next) {
        try {
            const rows = await transaction_service_1.TransactionService.listForExport(req.query);
            const csv = (0, transaction_service_1.toCSV)(rows);
            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', 'attachment; filename="transactions.csv"');
            res.send(csv);
        }
        catch (error) {
            next(error);
        }
    },
};
