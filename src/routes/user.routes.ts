import { NextFunction, Request, Response, Router } from "express";
import { UserController } from "../controllers/user.controller";
import { TicketController } from "../controllers/ticket.controller";
import TicketsRouter from "./ticket.routes";
import { UserService } from "../services/user.service";
import { authMiddleware } from "../middlewares/auth.middleware";
import { requireRole } from "../middlewares/role.middleware";
import { AuthenticatedRequest } from "../utils/interfaces";

const router = Router();

router.use(authMiddleware);

router.param("id", (req: AuthenticatedRequest, res: Response, next: NextFunction, id: number) => {
    const userId = Number(id);
    if (Number.isNaN(userId)) {
        return res.status(400).json({
            error: "id must be a number!"
        });
    }
    const user = UserService.findById(userId)
    if (!user) return res.status(400).json({
        error: "user not found"
    });
    //inject a data into the request
    req.user = user
    next()
})

/**
 * GET /api/users/
 * retrieve all users
 */
// router.get('/', testMiddleware, UserController.list);
router.get('/', UserController.list);
/**
 * POST /api/users
 * Create a user
 */
router.post('/', UserController.create);
/**
 * GET /api/users/:id
 * get one user by id
 */
router.get('/:id', requireRole("ADMIN", "CASHIER"), UserController.findOneById as any);
/**
 * GET /api/users/:id/tickets
 * get all the tickets generate by a user
 */
// router.get("/:id/tickets", UserController.tickets)
// router.get("/:id/tickets", TicketController.getTicketsByUser)
router.use("/:id/tickets", requireRole('CONTROLLER'), TicketsRouter) //nested route
export default router;

