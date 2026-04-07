import { Router } from "express";
import { MemberController } from "../controllers/member.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { requireRole } from "../middlewares/role.middleware";

const router = Router();

router.use(authMiddleware);
router.use(requireRole('ADMIN', 'CASHIER'));

// Static / specific paths must come before /:id
router.get('/qr/:uuid',  MemberController.findByQr);
router.post('/subscribe', MemberController.subscribe);

router.get('/',       MemberController.list);
router.get('/:id',    MemberController.getById);
router.put('/:id',    MemberController.update);

export default router;
