import { z } from "zod";

// Message validation schema
export const sendMessageSchema = z.object({
  message: z
    .string()
    .min(1, "Message cannot be empty")
    .max(1000, "Message cannot exceed 1000 characters")
    .refine((val) => val.trim().length > 0, {
      message: "Message cannot contain only whitespace",
    }),
  destId: z
    .string()
    .min(1, "Destination user ID is required")
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid destination user ID format"),
});

// Typing indicator validation schema
export const typingSchema = z.object({
  chatId: z
    .string()
    .min(1, "Chat ID is required")
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid chat ID format"),
  isTyping: z.boolean(),
});

// Chat ID validation schema for getting chat details
export const getChatSchema = z.object({
  userId: z
    .string()
    .min(1, "User ID is required")
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid user ID format"),
});

export type SendMessageInput = z.infer<typeof sendMessageSchema>;
export type TypingInput = z.infer<typeof typingSchema>;
export type GetChatInput = z.infer<typeof getChatSchema>;
