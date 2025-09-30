import { Router } from "express";
import { isAuthenticated } from "../../middlewares/auth.middleware";
import postService from "./post.service";
import { isValidParams } from "../../middlewares/param-validation.middleware";
import { getPostParamsSchema } from "./post.validation";

const router = Router();

router.post("/create", isAuthenticated, postService.create);
router.patch(
  "/:id",
  isAuthenticated,
  isValidParams(getPostParamsSchema),
  postService.addReaction
);
router.get("/:id", isAuthenticated, postService.getSpecificPost);
export default router;
