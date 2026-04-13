import { NextFunction, Request, Response } from "express";
import { TicketService } from "../services/ticket.service";
import { AuthenticatedRequest } from "../utils/interfaces";

export const TicketController = {
    async list(req: Request, res: Response, next: NextFunction) {
        try {
            const data = await TicketService.list(req.query as any);
            res.json({ success: true, data });
        } catch (error) {
            next(error);
        }
    },

    async getById(req: Request, res: Response, next: NextFunction) {
        try {
            const data = await TicketService.getById(Number(req.params.id));
            res.json({ success: true, data });
        } catch (error) {
            next(error);
        }
    },

    async sell(req: Request, res: Response, next: NextFunction) {
        try {
            const body = req.body as { id_membre?: number } | undefined;
            const idMembre = body?.id_membre != null ? Number(body.id_membre) : undefined;
            const data = await TicketService.sell(
                Number(req.params.id),
                Number.isFinite(idMembre) ? idMembre : undefined,
            );
            res.json({ success: true, data });
        } catch (error) {
            next(error);
        }
    },

    async validate(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        try {
            const { code } = req.body;
            if (!code) {
                return res.status(400).json({ success: false, message: 'Le champ code est requis' });
            }
            const result = await TicketService.validate(code, req.user!.id);
            res.json({ success: true, ...result });
        } catch (error) {
            next(error);
        }
    },
};
