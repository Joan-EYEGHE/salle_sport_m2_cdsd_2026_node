import { NextFunction, Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { AuthenticatedRequest } from "../utils/interfaces";
import { User } from "../models";

export const AuthController = {
    async login(req: Request, res: Response, next: NextFunction) {
        try {
            const { email, password } = req.body as { email: string; password: string };
            const result = await AuthService.login(email, password);
            return res.json({ success: true, data: result });
        } catch (error) {
            next(error);
        }
    },

    logout(_req: AuthenticatedRequest, res: Response, _next: NextFunction) {
        res.json({ success: true, message: 'Logged out' });
    },

    async refresh(req: Request, res: Response, next: NextFunction) {
        try {
            const { token, refreshToken } = req.body as { token?: string; refreshToken?: string };
            const rt = refreshToken ?? token;
            if (!rt) {
                return res.status(400).json({ success: false, message: 'refreshToken is required' });
            }
            const result = await AuthService.refresh(rt);
            return res.json({ success: true, data: result });
        } catch (error) {
            next(error);
        }
    },

    async me(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        try {
            if (!req.user?.id) {
                return res.status(401).json({ success: false, message: 'Unauthorized' });
            }
            const user = await User.findByPk(req.user.id, {
                attributes: ['id', 'email', 'role', 'fullName', 'isActive', 'firstConnection'],
            });
            if (!user || !user.isActive) {
                return res.status(401).json({ success: false, message: 'Unauthorized' });
            }
            return res.json({ success: true, data: user });
        } catch (error) {
            next(error);
        }
    },
}