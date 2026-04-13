"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccessLogController = void 0;
const accesslog_service_1 = require("../services/accesslog.service");
exports.AccessLogController = {
    async list(req, res, next) {
        try {
            const data = await accesslog_service_1.AccessLogService.list(req.query);
            res.json({ success: true, data });
        }
        catch (error) {
            next(error);
        }
    },
    async stats(req, res, next) {
        try {
            const data = await accesslog_service_1.AccessLogService.stats(req.query);
            res.json({ success: true, data });
        }
        catch (error) {
            next(error);
        }
    },
    async exportCsv(req, res, next) {
        try {
            const rows = await accesslog_service_1.AccessLogService.listForExport(req.query);
            const csv = (0, accesslog_service_1.toCSV)(rows);
            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', 'attachment; filename="access_logs.csv"');
            res.send(csv);
        }
        catch (error) {
            next(error);
        }
    },
};
