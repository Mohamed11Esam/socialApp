import { Router } from "express";
import authService from "./auth.service";
import { asyncHandler } from "../../utils";
import { isAuthenticated } from "../../middlewares/auth.middleware";
import { isValid } from "../../middlewares/vaildation.middleware";
import {
  registerSchema,
  verifyOtpSchema,
  loginSchema,
  resendOtpSchema,
  changePasswordSchema,
  verifyLoginOtpSchema,
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

router.patch(
  "/change-password",
  // requires authentication
  isAuthenticated,
  // validate body
  isValid(changePasswordSchema),
  asyncHandler(authService.changePassword.bind(authService))
);

router.post(
  "/verify-login-otp",
  isValid(verifyLoginOtpSchema),
  asyncHandler(authService.verifyLoginOtp.bind(authService))
);

export default router;
