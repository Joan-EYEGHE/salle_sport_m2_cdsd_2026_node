"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const accesslog_controller_1 = require("../controllers/accesslog.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const role_middleware_1 = require("../middlewares/role.middleware");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.authMiddleware);
// Static paths before any future /:id
router.get('/stats', (0, role_middleware_1.requireRole)('ADMIN', 'CASHIER', 'CONTROLLER'), accesslog_controller_1.AccessLogController.stats);
router.get('/export', (0, role_middleware_1.requireRole)('ADMIN', 'CONTROLLER'), accesslog_controller_1.AccessLogController.exportCsv);
router.get('/', (0, role_middleware_1.requireRole)('ADMIN', 'CASHIER', 'CONTROLLER'), accesslog_controller_1.AccessLogController.list);
exports.default = router;
