"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const member_controller_1 = require("../controllers/member.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const role_middleware_1 = require("../middlewares/role.middleware");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.authMiddleware);
// Static / specific paths must come before /:id
router.get('/qr/:uuid', (0, role_middleware_1.requireRole)('ADMIN', 'CASHIER'), member_controller_1.MemberController.findByQr);
router.post('/subscribe', (0, role_middleware_1.requireRole)('ADMIN', 'CASHIER'), member_controller_1.MemberController.subscribe);
router.get('/', (0, role_middleware_1.requireRole)('ADMIN', 'CASHIER'), member_controller_1.MemberController.list);
router.post('/', (0, role_middleware_1.requireRole)('ADMIN', 'CASHIER'), member_controller_1.MemberController.create);
router.get('/:id', (0, role_middleware_1.requireRole)('ADMIN', 'CASHIER', 'CONTROLLER'), member_controller_1.MemberController.getById);
router.put('/:id', (0, role_middleware_1.requireRole)('ADMIN', 'CASHIER'), member_controller_1.MemberController.update);
exports.default = router;
