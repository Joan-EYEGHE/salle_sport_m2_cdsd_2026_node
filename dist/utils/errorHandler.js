"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const errorHandler = (err, _req, res, _next) => {
    console.log(err);
    const status = err.status || 500;
    res.status(status).json({
        success: false,
        message: err.message || 'Internal server error!'
    });
};
exports.errorHandler = errorHandler;
