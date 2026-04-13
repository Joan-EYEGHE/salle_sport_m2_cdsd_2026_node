import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../utils/jwt";
import { UserService } from "../services/user.service";
import { AuthenticatedRequest } from "../utils/interfaces";
import { User } from "../models";


export const authMiddleware = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const header = req.headers.authorization;
        if (!header || !header.startsWith('Bearer ')) {
            return res.status(401).json({ success: false, message: 'Unauthorized' })
        }

        const token = header.split(' ')[1];
        //verify if the token valid
        const decoded = verifyToken(token);
        //find the user with credentials
        const user = await User.findByPk(decoded.id);
        if (!user || !user.active) {
            return res.status(401).json({ success: false, message: 'Unauthorized' })
        }
        //inject the user in the request
        req.user = {
            id: user.id,
            email: user.email,
            role: user.role,
            fullname: user.fullName
        };
        next()

    } catch (error) {
        console.log(error)
        return res.status(401).json({ success: false, message: 'Invalid token' })
    }
}