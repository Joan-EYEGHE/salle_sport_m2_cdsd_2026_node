"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jwt_1 = require("../utils/jwt");
const models_1 = require("../models");
const authMiddleware = async (req, res, next) => {
    try {
        const header = req.headers.authorization;
        if (!header || !header.startsWith('Bearer ')) {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }
        const token = header.split(' ')[1];
        //verify if the token valid
        const decoded = (0, jwt_1.verifyToken)(token);
        //find the user with credentials
        const user = await models_1.User.findByPk(decoded.id);
        if (!user || !user.isActive) {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }
        //inject the user in the request
        req.user = {
            id: user.id,
            email: user.email,
            role: user.role,
            fullname: user.fullName
        };
        next();
    }
    catch (error) {
        console.log(error);
        return res.status(401).json({ success: false, message: 'Invalid token' });
    }
};
exports.authMiddleware = authMiddleware;
