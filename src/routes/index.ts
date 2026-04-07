import { Router } from "express";
import authRoutes from "./auth.routes";
import userRoutes from "./user.routes";
import ticketRoutes from "./ticket.routes";
import activityRoutes from "./activity.routes";
import memberRoutes from "./member.routes";
import transactionRoutes from "./transaction.routes";

const router = Router();

router.use('/auth',         authRoutes);
router.use('/users',        userRoutes);
router.use('/tickets',      ticketRoutes);
router.use('/activities',   activityRoutes);
router.use('/members',      memberRoutes);
router.use('/transactions', transactionRoutes);

export default router;
