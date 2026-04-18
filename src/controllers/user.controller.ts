import { NextFunction, Request, Response } from "express"
import { UserService } from "../services/user.service";
// AUDIT FIX: import TicketService inutilisé supprimé
import { AuthenticatedRequest } from "../utils/interfaces";

export const UserController = {
    async list(req: Request, res: Response, next: NextFunction) {
        try {
            const allUsers = await UserService.list(req.query)
            res.json({
                success: true,
                data: allUsers
            })
        } catch (error) {
            next(error);
        }

    },
    findOneById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        const user = req.targetUser;
        res.status(200).json({
            user
        })
    },
    // tickets(req: Request, res: Response) {
    //     const userId = +req.params.id;
    //     const allTickets = TicketService.getAll();
    //     const userTickets = allTickets.filter(t => t.userId === userId);
    //     res.status(200).json({
    //         count: userTickets.length,
    //         data: userTickets
    //     })
    // },
    async create(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        try {
            const user = await UserService.create(req.body);
            res.status(201).json({
                success: true,
                data: user
            })
        } catch (error) {
            next(error);
        }
    },
    stats() { },
    async update(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        try {
            const id = Number(req.params.id);
            const updated = await UserService.update(id, req.body);
            res.json({ success: true, data: updated });
        } catch (error) {
            next(error);
        }
    },

    async destroy(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        try {
            const id = Number(req.params.id);
            await UserService.softDelete(id);
            res.json({ success: true });
        } catch (error) {
            next(error);
        }
    },
}