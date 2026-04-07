import { Router } from "express";
import { ActivityController } from "../controllers/activity.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { requireRole } from "../middlewares/role.middleware";

const router = Router();

router.use(authMiddleware);

router.get('/',     ActivityController.list);
router.get('/:id',  ActivityController.getById);

router.post('/',    requireRole('ADMIN'), ActivityController.create);
router.put('/:id',  requireRole('ADMIN'), ActivityController.update);
router.delete('/:id', requireRole('ADMIN'), ActivityController.softDelete);

export default router;
