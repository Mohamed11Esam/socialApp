import { Router } from "express";
import { isAuthenticated } from "../../middlewares/auth.middleware";
import commentService from "./comment.service";
import {
  commentParamsSchema,
  createCommentSchema,
  updateCommentSchema,
} from "./comment.validation";
import { isValidParams } from "../../middlewares/param-validation.middleware";
import { isValid } from "../../middlewares/vaildation.middleware";

const router = Router({ mergeParams: true });

// Mounted by post router at '/:postId/comment' so accept both creating a top-level comment
// and replying to an existing comment by allowing an optional `id` param on the route
// Support both creating a top-level comment and replying to an existing comment by
// registering two explicit routes instead of using an optional parameter token
// (some path-to-regexp versions used by the router in this runtime don't accept
// the `:id?` shorthand and crash at startup).

router.post(
  "{/:id}",
  isAuthenticated,
  isValidParams(commentParamsSchema),
  isValid(createCommentSchema),
  commentService.createComment
);
router.get(
  "/:id",
  isAuthenticated,
  isValidParams(commentParamsSchema),
  commentService.getSpecific
);

// Freeze / unfreeze comment (only comment owner can do this)
router.patch(
  "/:id/freeze",
  isAuthenticated,
  isValidParams(commentParamsSchema),
  commentService.freezeComment
);

router.patch(
  "/:id/unfreeze",
  isAuthenticated,
  isValidParams(commentParamsSchema),
  commentService.unFreezeComment
);

// update comment (nested)
router.patch(
  "/:id",
  isAuthenticated,
  isValidParams(commentParamsSchema),
  isValid(updateCommentSchema),
  commentService.updateComment
);

export default router;
