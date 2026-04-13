import { Router } from "express";
import { MemberController } from "../controllers/member.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { requireRole } from "../middlewares/role.middleware";

const router = Router();

router.use(authMiddleware);

// Static / specific paths must come before /:id
router.get('/qr/:uuid', requireRole('ADMIN', 'CASHIER'), MemberController.findByQr);
router.post('/subscribe', requireRole('ADMIN', 'CASHIER'), MemberController.subscribe);

router.get('/', requireRole('ADMIN', 'CASHIER'), MemberController.list);
router.post('/', requireRole('ADMIN', 'CASHIER'), MemberController.create);
router.get('/:id', requireRole('ADMIN', 'CASHIER', 'CONTROLLER'), MemberController.getById);
router.put('/:id', requireRole('ADMIN', 'CASHIER'), MemberController.update);

export default router;
