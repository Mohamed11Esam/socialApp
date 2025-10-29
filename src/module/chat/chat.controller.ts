import { Router } from "express";
import { isAuthenticated } from "../../middlewares/auth.middleware";
import { asyncHandler } from "../../utils";
import { chatService } from "./chat,service";
import { isValidParams } from "../../middlewares/param-validation.middleware";
import { getChatParamsSchema } from "./chat.validation";

const router = Router();

router.get(
  "/:userId",
  isAuthenticated,
  isValidParams(getChatParamsSchema),
  asyncHandler(chatService.getChat.bind(chatService))
);
export default router;
