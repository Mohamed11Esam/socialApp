import { z } from "zod";

export const getPostParamsSchema = z.object({
  id: z
    .string()
    .min(1, "Post ID is required")
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid post ID format"),
});
