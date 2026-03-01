import { NextFunction, Request, Response } from "express"
import { UserService } from "../services/user.service";
import { TicketService } from "../services/ticket.service";
import { AuthenticatedRequest } from "../utils/interfaces";

export const UserController = {
    async list(req: Request, res: Response, next: NextFunction) {
        console.log("Controller")
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
        const user = req.user;
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
    update() { },
    changePassword() { },
}