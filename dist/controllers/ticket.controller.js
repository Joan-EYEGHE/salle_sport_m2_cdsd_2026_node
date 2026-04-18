"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TicketController = void 0;
const ticket_service_1 = require("../services/ticket.service");
exports.TicketController = {
    async list(req, res, next) {
        try {
            const data = await ticket_service_1.TicketService.list(req.query);
            res.json({ success: true, data });
        }
        catch (error) {
            next(error);
        }
    },
    async getById(req, res, next) {
        try {
            const data = await ticket_service_1.TicketService.getById(Number(req.params.id));
            res.json({ success: true, data });
        }
        catch (error) {
            next(error);
        }
    },
    async sell(req, res, next) {
        try {
            const data = await ticket_service_1.TicketService.sell(Number(req.params.id));
            res.json({ success: true, data });
        }
        catch (error) {
            next(error);
        }
    },
    async validate(req, res, next) {
        try {
            const { code } = req.body;
            if (!code) {
                return res.status(400).json({ success: false, message: 'Le champ code est requis' });
            }
            const result = await ticket_service_1.TicketService.validate(code, req.user.id);
            res.json({ success: true, ...result });
        }
        catch (error) {
            next(error);
        }
    },
};
