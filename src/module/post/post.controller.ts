import { Router } from "express";
import { isAuthenticated } from "../../middlewares/auth.middleware";
import postService from "./post.service";
import { isValidParams } from "../../middlewares/param-validation.middleware";
import { isValid } from "../../middlewares/vaildation.middleware";
import {
  getPostParamsSchema,
  createPostSchema,
  reactionSchema,
  updatePostSchema,
} from "./post.validation";
import commentRouter from "../comment/comment.controller";

const router = Router();
router.use("/:postId/comment", commentRouter);
router.post(
  "/create",
  isAuthenticated,
  isValid(createPostSchema),
  postService.create
);
router.patch(
  "/:id",
  isAuthenticated,
  isValidParams(getPostParamsSchema),
  isValid(reactionSchema),
  postService.addReaction
);
// update post (owner only)
router.patch(
  "/:id/update",
  isAuthenticated,
  isValidParams(getPostParamsSchema),
  isValid(updatePostSchema),
  postService.updatePost
);
router.get(
  "/:id",
  isAuthenticated,
  isValidParams(getPostParamsSchema),
  postService.getSpecificPost
);
router.delete(
  "/:id",
  isAuthenticated,
  isValidParams(getPostParamsSchema),
  postService.deletePost
);
router.patch(
  "/:id/freeze",
  isAuthenticated,
  isValidParams(getPostParamsSchema),
  postService.freezePost
);
router.patch(
  "/:id/unfreeze",
  isAuthenticated,
  isValidParams(getPostParamsSchema),
  postService.unFreezePost
);
export default router;
