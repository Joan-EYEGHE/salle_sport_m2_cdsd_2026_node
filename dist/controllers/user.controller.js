"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const user_service_1 = require("../services/user.service");
exports.UserController = {
    async list(req, res, next) {
        try {
            const allUsers = await user_service_1.UserService.list(req.query);
            res.json({
                success: true,
                data: allUsers
            });
        }
        catch (error) {
            next(error);
        }
    },
    findOneById(req, res, next) {
        const user = req.targetUser;
        res.status(200).json({
            user
        });
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
    async create(req, res, next) {
        try {
            const user = await user_service_1.UserService.create(req.body);
            res.status(201).json({
                success: true,
                data: user
            });
        }
        catch (error) {
            next(error);
        }
    },
    stats() { },
    async update(req, res, next) {
        try {
            const id = Number(req.params.id);
            const updated = await user_service_1.UserService.update(id, req.body);
            res.json({ success: true, data: updated });
        }
        catch (error) {
            next(error);
        }
    },
    async destroy(req, res, next) {
        try {
            const id = Number(req.params.id);
            await user_service_1.UserService.softDelete(id);
            res.json({ success: true });
        }
        catch (error) {
            next(error);
        }
    },
};
