import { Router } from "express";
import authService from "./auth.service";
import { asyncHandler } from "../../utils";
import { isValid } from "../../middlewares/vaildation.middleware";
import {
  registerSchema,
  verifyOtpSchema,
  loginSchema,
  resendOtpSchema,
} from "./auth.validation";

const router = Router();
// bind and wrap so `this` is preserved and errors are forwarded to the JSON error handler
router.post(
  "/register",
  isValid(registerSchema),
  asyncHandler(authService.register.bind(authService))
);
router.post(
  "/verify-otp",
  isValid(verifyOtpSchema),
  asyncHandler(authService.verifyOtp.bind(authService))
);
router.post(
  "/login",
  isValid(loginSchema),
  asyncHandler(authService.login.bind(authService))
);
router.post(
  "/resend-otp",
  isValid(resendOtpSchema),
  asyncHandler(authService.resendOtp.bind(authService))
);

export default router;
