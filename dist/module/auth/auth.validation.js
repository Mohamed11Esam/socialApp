"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resendOtpSchema = exports.loginSchema = exports.verifyOtpSchema = exports.registerSchema = void 0;
const zod_1 = require("zod");
const utils_1 = require("../../utils");
exports.registerSchema = zod_1.z.object({
    fullName: zod_1.z
        .string()
        .min(2, "Full name must be at least 2 characters long")
        .max(100, "Full name must be at most 100 characters long"),
    email: zod_1.z.email("Invalid email address"),
    password: zod_1.z
        .string()
        .min(6, "Password must be at least 6 characters long")
        .max(100, "Password must be at most 100 characters long"),
    phone: zod_1.z.string().optional(),
    gender: zod_1.z.enum(utils_1.GENDER).optional(),
});
exports.verifyOtpSchema = zod_1.z.object({
    email: zod_1.z.email("Invalid email address"),
    otp: zod_1.z
        .string()
        .min(4, "OTP must be at least 4 characters")
        .max(10, "OTP must be at most 10 characters"),
});
exports.loginSchema = zod_1.z
    .object({
    email: zod_1.z.email("Invalid email address").optional(),
    phone: zod_1.z.string().optional(),
    password: zod_1.z
        .string()
        .min(6, "Password must be at least 6 characters long"),
})
    .refine((data) => data.email || data.phone, {
    message: "Either email or phone must be provided",
    path: ["email"], // Error will be shown on email field
});
exports.resendOtpSchema = zod_1.z.object({
    email: zod_1.z.email("Invalid email address"),
});
