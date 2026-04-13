import { NextFunction, Request, Response } from "express";
import { MemberService } from "../services/member.service";

export const MemberController = {
    async list(req: Request, res: Response, next: NextFunction) {
        try {
            const data = await MemberService.list();
            res.json({ success: true, data });
        } catch (error) {
            next(error);
        }
    },

    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const data = await MemberService.create(req.body);
            res.status(201).json({ success: true, data });
        } catch (error) {
            next(error);
        }
    },

    async getById(req: Request, res: Response, next: NextFunction) {
        try {
            const data = await MemberService.getById(req.params.id as string);
            res.json({ success: true, data });
        } catch (error) {
            next(error);
        }
    },

    async findByQr(req: Request, res: Response, next: NextFunction) {
        try {
            const data = await MemberService.findByQr(req.params.uuid as string);
            res.json({ success: true, data });
        } catch (error) {
            next(error);
        }
    },

    async update(req: Request, res: Response, next: NextFunction) {
        try {
            const data = await MemberService.update(req.params.id as string, req.body);
            res.json({ success: true, data });
        } catch (error) {
            next(error);
        }
    },

    async subscribe(req: Request, res: Response, next: NextFunction) {
        try {
            const data = await MemberService.subscribe(req.body);
            res.status(201).json({ success: true, data });
        } catch (error) {
            next(error);
        }
    },
};
