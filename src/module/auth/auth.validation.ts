import { z } from "zod";
import { RegisterDto, VerifyOtpDto, LoginDto } from "./auth.dto";
import { GENDER } from "../../utils";

export const registerSchema = z.object<RegisterDto>({
  fullName: z
    .string()
    .min(2, "Full name must be at least 2 characters long")
    .max(100, "Full name must be at most 100 characters long")
    .refine((name) => name.trim().length > 0, {
      message: "Full name cannot be empty",
    }) as unknown as string,
  email: z.email("Invalid email address") as unknown as string,
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long")
    .max(
      100,
      "Password must be at most 100 characters long"
    ) as unknown as string,
  phone: z.string().optional() as unknown as string | undefined,
  gender: z.enum(GENDER).optional() as unknown as GENDER | undefined,
});

export const verifyOtpSchema = z.object<VerifyOtpDto>({
  email: z.email("Invalid email address") as unknown as string,
  otp: z
    .string()
    .min(4, "OTP must be at least 4 characters")
    .max(10, "OTP must be at most 10 characters") as unknown as string,
});

export const loginSchema = z
  .object<LoginDto>({
    email: z.email("Invalid email address").optional() as unknown as
      | string
      | undefined,
    phone: z.string().optional() as unknown as string | undefined,
    password: z
      .string()
      .min(
        6,
        "Password must be at least 6 characters long"
      ) as unknown as string,
  })
  .refine((data) => data.email || data.phone, {
    message: "Either email or phone must be provided",
    path: ["email"], // Error will be shown on email field
  });

export const resendOtpSchema = z.object({
  email: z.email("Invalid email address") as unknown as string,
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(6, "Current password must be at least 6 characters"),
  newPassword: z.string().min(6, "New password must be at least 6 characters"),
});

export const verifyLoginOtpSchema = z.object({
  email: z.string().email(),
  otp: z.string().min(4),
});
