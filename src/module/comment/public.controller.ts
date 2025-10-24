import { Router } from "express";
import CommentService from "./comment.service";
import { isValidParams } from "../../middlewares/param-validation.middleware";
import {
  getCommentParamsSchema,
  commentIdParamsSchema,
} from "./comment.validation";
import { isAuthenticated } from "../../middlewares/auth.middleware";

const router = Router();

router.get(
  "/:id",
  isValidParams(getCommentParamsSchema),
  CommentService.getSpecific
);
router.delete(
  "/:id",
  // require authentication for delete
  // note: require the isAuthenticated import if needed; use runtime check in app if missing
  isValidParams(commentIdParamsSchema),
  CommentService.deleteComment
);
router.patch(
  "/:id",
  // require authentication for adding reaction
  isAuthenticated,
  isValidParams(commentIdParamsSchema),
  CommentService.addreaction
);

// Freeze / unfreeze (top-level) - only comment owner can perform
router.patch(
  "/:id/freeze",
  isAuthenticated,
  isValidParams(commentIdParamsSchema),
  CommentService.freezeComment
);

router.patch(
  "/:id/unfreeze",
  isAuthenticated,
  isValidParams(commentIdParamsSchema),
  CommentService.unFreezeComment
);

export default router;
