import { Router } from "express";
import { isAuthenticated } from "../../middlewares/auth.middleware";
import postService from "./post.service";
import { isValidParams } from "../../middlewares/param-validation.middleware";
import { isValid } from "../../middlewares/vaildation.middleware";
import { getPostParamsSchema, createPostSchema } from "./post.validation";
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
  postService.addReaction
);
router.get(
  "/:id",
  isAuthenticated,
  isValidParams(getPostParamsSchema),
  postService.getSpecificPost
);
export default router;
