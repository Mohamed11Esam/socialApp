"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerSchema = void 0;
const zod_1 = require("zod");
const utils_1 = require("../../utils");
exports.registerSchema = zod_1.z.object({
    fullName: zod_1.z.string().min(2, 'Full name must be at least 2 characters long').max(100, 'Full name must be at most 100 characters long'),
    email: zod_1.z.email('Invalid email address'),
    password: zod_1.z.string().min(6, 'Password must be at least 6 characters long').max(100, 'Password must be at most 100 characters long'),
    phone: zod_1.z.string().optional(),
    gender: zod_1.z.enum(utils_1.GENDER).optional(),
});
