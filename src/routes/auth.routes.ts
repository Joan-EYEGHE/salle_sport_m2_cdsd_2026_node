import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.post('/login',   AuthController.login)
router.post('/logout',  authMiddleware, AuthController.logout as any)
router.post('/refresh', AuthController.refresh)
router.get('/me',       authMiddleware, AuthController.me)

export default router;