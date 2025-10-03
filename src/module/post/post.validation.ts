import { z } from "zod";

export const getPostParamsSchema = z.object({
  id: z
    .string()
    .min(1, "Post ID is required")
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid post ID format"),
});

export const createPostSchema = z
  .object({
    content: z.string().optional(),
    attachments: z.array(z.any()).optional(),
  })
  .refine(
    (data) =>
      !!(data.content && data.content.toString().trim().length > 0) ||
      (data.attachments && data.attachments.length > 0),
    { message: "Either content or attachments is required" }
  );
