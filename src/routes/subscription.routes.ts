import { Router } from "express";
import { SubscriptionController } from "../controllers/subscription.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { requireRole } from "../middlewares/role.middleware";

const router = Router();

router.use(authMiddleware);
router.use(requireRole("ADMIN", "CASHIER"));

router.get("/expiring-soon", SubscriptionController.expiringSoon);
router.post("/", SubscriptionController.create);
router.get("/", SubscriptionController.list);
router.get("/:id", SubscriptionController.getById);
router.delete("/:id", requireRole("ADMIN"), SubscriptionController.remove);

export default router;
