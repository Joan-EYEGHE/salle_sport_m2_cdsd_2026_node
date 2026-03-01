import { Request, Response } from "express"
import { UserService } from "../services/user.service";
import { TicketService } from "../services/ticket.service";
import { AuthenticatedRequest } from "../utils/interfaces";

export const UserController = {
    list(req: Request, res: Response) {

        const users = UserService.list()
        res.json({
            success: true,
            data: users
        })
    },
    findOneById(req: AuthenticatedRequest, res: Response) {
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
    create() { },
    stats() { },
    update() { },
    changePassword() { },
}