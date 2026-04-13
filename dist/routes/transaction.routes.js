"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const transaction_controller_1 = require("../controllers/transaction.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const role_middleware_1 = require("../middlewares/role.middleware");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.authMiddleware);
router.use((0, role_middleware_1.requireRole)('ADMIN', 'CASHIER'));
// Static paths before any future /:id routes
router.get('/summary', transaction_controller_1.TransactionController.summary);
router.get('/export', transaction_controller_1.TransactionController.exportCsv);
router.get('/', transaction_controller_1.TransactionController.list);
router.post('/', transaction_controller_1.TransactionController.create);
exports.default = router;
