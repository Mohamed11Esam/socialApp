import { z } from "zod";

export const getUserProfileSchema = z.object({
  userId: z
    .string()
    .min(1, "User ID is required")
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid user ID format"),
});

export const updateProfileSchema = z.object({
  fullName: z.string().min(2).max(100).optional(),
  phone: z.string().optional(),
  gender: z.string().optional(),
});

// Params schema for blocking/unblocking a user
export const blockUserParamsSchema = z.object({
  userId: z
    .string()
    .min(1)
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid user ID format"),
});

// Param schema for friend operations (same shape)
export const friendUserParamsSchema = z.object({
  userId: z
    .string()
    .min(1)
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid user ID format"),
});

export const toggle2FASchema = z.object({
  enable: z.boolean(),
  password: z.string().optional(),
});

export const changeEmailSchema = z.object({
  newEmail: z.string().email("Invalid email address"),
  currentPassword: z
    .string()
    .min(6, "Current password must be at least 6 characters"),
});
