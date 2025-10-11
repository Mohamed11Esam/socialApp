import { Router } from "express";
import UserService from "./user.service";
import { asyncHandler } from "../../utils";
import { isValidParams } from "../../middlewares/param-validation.middleware";
import { getUserProfileSchema, updateProfileSchema } from "./user.validation";
import { isValid } from "../../middlewares/vaildation.middleware";
import { isAuthenticated } from "../../middlewares/auth.middleware";
import { changeEmailSchema } from "./user.validation";
import { toggle2FASchema } from "./user.validation";

const router = Router();

router.get(
  "/profile/:userId",
  isValidParams(getUserProfileSchema),
  asyncHandler(UserService.getUserProfile)
);

router.patch(
  "/profile",
  isAuthenticated,
  isValid(updateProfileSchema),
  asyncHandler(UserService.updateProfile)
);

router.patch(
  "/email",
  isAuthenticated,
  isValid(changeEmailSchema),
  asyncHandler(UserService.changeEmail)
);

router.patch(
  "/2fa",
  isAuthenticated,
  isValid(toggle2FASchema),
  asyncHandler(UserService.toggleTwoFactor)
);

export default router;
