import { Router } from "express";
import UserService from "./user.service";
import { asyncHandler } from "../../utils";
import { isValidParams } from "../../middlewares/param-validation.middleware";
import {
  getUserProfileSchema,
  updateProfileSchema,
  blockUserParamsSchema,
  friendUserParamsSchema,
  changeEmailSchema,
  toggle2FASchema,
} from "./user.validation";
import { isValid } from "../../middlewares/vaildation.middleware";
import { isAuthenticated } from "../../middlewares/auth.middleware";

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
  "/block/:userId",
  isAuthenticated,
  isValidParams(blockUserParamsSchema),
  asyncHandler(UserService.blockUser)
);

router.patch(
  "/unblock/:userId",
  isAuthenticated,
  isValidParams(blockUserParamsSchema),
  asyncHandler(UserService.unblockUser)
);

// Friend operations
router.post(
  "/friend/request/:userId",
  isAuthenticated,
  isValidParams(friendUserParamsSchema),
  asyncHandler(UserService.sendFriendRequest)
);

router.delete(
  "/friend/request/:userId",
  isAuthenticated,
  isValidParams(friendUserParamsSchema),
  asyncHandler(UserService.cancelFriendRequest)
);

router.post(
  "/friend/accept/:userId",
  isAuthenticated,
  isValidParams(friendUserParamsSchema),
  asyncHandler(UserService.acceptFriendRequest)
);

router.delete(
  "/friend/:userId",
  isAuthenticated,
  isValidParams(friendUserParamsSchema),
  asyncHandler(UserService.unFriend)
);

router.get("/friends", isAuthenticated, asyncHandler(UserService.getFriends));

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
