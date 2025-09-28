"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPostParamsSchema = void 0;
const zod_1 = require("zod");
exports.getPostParamsSchema = zod_1.z.object({
    id: zod_1.z
        .string()
        .min(1, "Post ID is required")
        .regex(/^[0-9a-fA-F]{24}$/, "Invalid post ID format"),
});
