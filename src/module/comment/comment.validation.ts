import { z } from "zod";

// Body schema for creating comments
export const createCommentSchema = z.object({
  content: z.string().optional(),
  attachments: z.array(z.any()).optional(),
});

// Params schema to validate optional comment id and required postId (postId comes from parent router)
export const commentParamsSchema = z.object({
  id: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .optional(),
  postId: z
    .string()
    .min(1)
    .regex(/^[0-9a-fA-F]{24}$/),
});

// Params schema for public comment routes (top-level /comment/:id)
export const commentIdParamsSchema = z.object({
  id: z
    .string()
    .min(1)
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid comment id"),
});

// Params schema for public comment endpoints that only require the comment id
export const getCommentParamsSchema = z.object({
  id: z
    .string()
    .min(1)
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid comment ID format"),
});
