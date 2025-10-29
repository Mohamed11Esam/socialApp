import { z } from "zod";

// Chat user ID parameter validation
export const getChatParamsSchema = z.object({
  userId: z
    .string()
    .min(1, "User ID is required")
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid user ID format"),
});

export type GetChatParams = z.infer<typeof getChatParamsSchema>;
