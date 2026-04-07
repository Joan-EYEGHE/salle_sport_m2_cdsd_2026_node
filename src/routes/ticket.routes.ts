import { Router } from "express";
import { TicketController } from "../controllers/ticket.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { requireRole } from "../middlewares/role.middleware";

const router = Router();

router.use(authMiddleware);

// POST /validate before PUT /:id/sell to avoid route conflicts
router.post('/validate', requireRole('ADMIN', 'CONTROLLER'), TicketController.validate as any);

router.get('/',          requireRole('ADMIN', 'CASHIER'), TicketController.list);
router.get('/:id',       requireRole('ADMIN', 'CASHIER'), TicketController.getById);
router.put('/:id/sell',  requireRole('ADMIN', 'CASHIER'), TicketController.sell);

export default router;
