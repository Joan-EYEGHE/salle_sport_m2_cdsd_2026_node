import { Router } from "express";
import { AccessLogController } from "../controllers/accesslog.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { requireRole } from "../middlewares/role.middleware";

const router = Router();

router.use(authMiddleware);
router.use(requireRole('ADMIN', 'CONTROLLER'));

// Static paths before any future /:id
router.get('/stats',  AccessLogController.stats);
router.get('/export', AccessLogController.exportCsv);
router.get('/',       AccessLogController.list);

export default router;
