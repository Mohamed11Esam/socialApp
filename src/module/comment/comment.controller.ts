import { Router } from "express";
import { isAuthenticated } from "../../middlewares/auth.middleware";
import commentService from "./comment.service";
import { commentParamsSchema, createCommentSchema } from "./comment.validation";
import { isValidParams } from "../../middlewares/param-validation.middleware";
import { isValid } from "../../middlewares/vaildation.middleware";

const router = Router({ mergeParams: true });

// Mounted by post router at '/:postId/comment' so use root path here
router.post(
  "/",
  isAuthenticated,
  isValidParams(commentParamsSchema),
  isValid(createCommentSchema),
  commentService.createComment
);

export default router;
