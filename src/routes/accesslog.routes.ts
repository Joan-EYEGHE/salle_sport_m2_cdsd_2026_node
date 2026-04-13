import { Router } from "express";
import { AccessLogController } from "../controllers/accesslog.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { requireRole } from "../middlewares/role.middleware";

const router = Router();

router.use(authMiddleware);

// Static paths before any future /:id
router.get('/stats', requireRole('ADMIN', 'CONTROLLER'), AccessLogController.stats);
router.get('/export', requireRole('ADMIN', 'CONTROLLER'), AccessLogController.exportCsv);
router.get('/', requireRole('ADMIN', 'CASHIER', 'CONTROLLER'), AccessLogController.list);

export default router;
