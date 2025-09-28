"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserProfileSchema = void 0;
const zod_1 = require("zod");
exports.getUserProfileSchema = zod_1.z.object({
    userId: zod_1.z
        .string()
        .min(1, "User ID is required")
        .regex(/^[0-9a-fA-F]{24}$/, "Invalid user ID format"),
});
