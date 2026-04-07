import { Router } from "express";
import { TransactionController } from "../controllers/transaction.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { requireRole } from "../middlewares/role.middleware";

const router = Router();

router.use(authMiddleware);
router.use(requireRole('ADMIN', 'CASHIER'));

// Static paths before any future /:id routes
router.get('/summary', TransactionController.summary);
router.get('/export',  TransactionController.exportCsv);

router.get('/',   TransactionController.list);
router.post('/',  TransactionController.create);

export default router;
