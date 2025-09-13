import { Router } from "express";
import authService from "./auth.service";
import { asyncHandler } from "../../utils";
import { isValid } from "../../middlewares/vaildation.middleware";
import { registerSchema } from "./auth.validation";

const router = Router();
// bind and wrap so `this` is preserved and errors are forwarded to the JSON error handler
router.post("/register", isValid(registerSchema), asyncHandler(authService.register.bind(authService)));
router.post("/verify-otp", asyncHandler(authService.verifyOtp.bind(authService)));
router.post("/login", asyncHandler(authService.login.bind(authService)));

export default router;
