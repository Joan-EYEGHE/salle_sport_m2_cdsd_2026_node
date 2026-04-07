import { Router } from "express";
import { BatchController } from "../controllers/batch.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { requireRole } from "../middlewares/role.middleware";

const router = Router();

router.use(authMiddleware);
router.use(requireRole('ADMIN', 'CASHIER'));

router.get('/',          BatchController.list);
router.post('/generate', BatchController.generate);
router.get('/:id',       BatchController.getById);

export default router;
