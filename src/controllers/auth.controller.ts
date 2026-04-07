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
    // AUDIT FIX: stubs vides → requêtes bloquées indéfiniment
    logout(req: Request, res: Response, next: NextFunction) {
        res.json({ success: true, message: 'Logged out' });
    },
    refresh(req: Request, res: Response, next: NextFunction) {
        res.status(501).json({ success: false, message: 'Not implemented' });
    },
    me(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        res.json({ success: true, data: req.user ?? null });
    },
}