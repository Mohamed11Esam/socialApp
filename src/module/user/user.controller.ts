import { Router } from "express";
import UserService from "./user.service";
import { asyncHandler } from "../../utils";
import { isValidParams } from "../../middlewares/param-validation.middleware";
import { getUserProfileSchema } from "./user.validation";

const router = Router();

router.get(
  "/profile/:userId",
  isValidParams(getUserProfileSchema),
  asyncHandler(UserService.getUserProfile)
);

export default router;
