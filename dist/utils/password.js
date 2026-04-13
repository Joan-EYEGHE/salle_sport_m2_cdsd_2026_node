"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatePassword = exports.comparePassword = exports.hashPassword = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const hashPassword = async (plainPassword) => {
    const salt = await bcryptjs_1.default.genSalt(10);
    return bcryptjs_1.default.hash(plainPassword, salt);
};
exports.hashPassword = hashPassword;
const comparePassword = (plainPassword, hashPassword) => bcryptjs_1.default.compare(plainPassword, hashPassword);
exports.comparePassword = comparePassword;
const validatePassword = (password) => {
    if (!password || password.length < 6) {
        throw Object.assign(new Error('Password must be at least 6 characers!'), { status: 400 });
    }
};
exports.validatePassword = validatePassword;
