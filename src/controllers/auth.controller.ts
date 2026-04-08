import { NextFunction, Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { AuthenticatedRequest } from "../utils/interfaces";

export const AuthController = {
    async login(req: Request, res: Response, next: NextFunction) {
        try {
            const { email, password } = req.body as { email: string; password: string };
            //appel du service pour recuperer l'utilisateur avec ces credentials
            const result = await AuthService.login(email, password);
            return res.json({ success: true, data: result })
        } catch (error) {
            next(error)
        }
    },
    logout(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        res.json({ success: true, message: 'Logged out' });
    },
    async refresh(req: Request, res: Response, next: NextFunction) {
        try {
            const { token } = req.body as { token: string };
            if (!token) {
                return res.status(400).json({ success: false, message: 'Token is required' });
            }
            const result = await AuthService.refresh(token);
            return res.json({ success: true, data: result });
        } catch (error) {
            next(error);
        }
    },
    me(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        res.json({ success: true, data: req.user ?? null });
    },
}