"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.env = {
    port: Number(process.env.PORT || 5000),
    db: {
        host: process.env.DB_HOST || 'localhost',
        port: Number(process.env.DB_PORT || 3306), // AUDIT FIX: fallback était 8889 (MAMP), WAMP utilise 3306
        name: process.env.DB_NAME || 'salle_sport_m2_cdsd',
        user: process.env.DB_USER || 'root',
        pass: process.env.DB_PASS || '',
    },
    jwt: {
        secret: process.env.JWT_SECRET || 'secret',
        expiresIn: process.env.JWT_EXPIRES_IN || '1d',
        refreshSecret: process.env.JWT_REFRESH_SECRET || 'refresh_secret',
        refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
    }
};
