"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ticket_controller_1 = require("../controllers/ticket.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const role_middleware_1 = require("../middlewares/role.middleware");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.authMiddleware);
// POST /validate before PUT /:id/sell to avoid route conflicts
router.post('/validate', (0, role_middleware_1.requireRole)('ADMIN', 'CONTROLLER'), ticket_controller_1.TicketController.validate);
router.get('/', (0, role_middleware_1.requireRole)('ADMIN', 'CASHIER'), ticket_controller_1.TicketController.list);
router.get('/:id', (0, role_middleware_1.requireRole)('ADMIN', 'CASHIER'), ticket_controller_1.TicketController.getById);
router.put('/:id/sell', (0, role_middleware_1.requireRole)('ADMIN', 'CASHIER'), ticket_controller_1.TicketController.sell);
exports.default = router;
