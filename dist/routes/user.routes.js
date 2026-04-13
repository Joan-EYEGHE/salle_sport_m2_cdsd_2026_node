"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../controllers/user.controller");
const ticket_routes_1 = __importDefault(require("./ticket.routes")); // AUDIT FIX: import TicketController inutilisé supprimé
const user_service_1 = require("../services/user.service");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const role_middleware_1 = require("../middlewares/role.middleware");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.authMiddleware);
// AUDIT FIX: passage en async + await findById (était synchrone, méthode inexistante)
router.param("id", async (req, res, next, id) => {
    const userId = Number(id);
    if (Number.isNaN(userId)) {
        return res.status(400).json({ error: "id must be a number!" });
    }
    const user = await user_service_1.UserService.findById(userId);
    if (!user)
        return res.status(400).json({ error: "user not found" });
    req.user = user;
    next();
});
/**
 * GET /api/users/
 * retrieve all users
 */
// router.get('/', testMiddleware, UserController.list);
router.get('/', user_controller_1.UserController.list);
/**
 * POST /api/users
 * Create a user
 */
router.post('/', user_controller_1.UserController.create);
/**
 * GET /api/users/:id
 * get one user by id
 */
router.get('/:id', (0, role_middleware_1.requireRole)("ADMIN", "CASHIER"), user_controller_1.UserController.findOneById);
/**
 * GET /api/users/:id/tickets
 * get all the tickets generate by a user
 */
// router.get("/:id/tickets", UserController.tickets)
// router.get("/:id/tickets", TicketController.getTicketsByUser)
router.use("/:id/tickets", (0, role_middleware_1.requireRole)('CONTROLLER'), ticket_routes_1.default); //nested route
exports.default = router;
