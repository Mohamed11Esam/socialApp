import { Router } from "express";
import UserService from './user.service';

const router = Router();

router.get("/profile/:userId", UserService.getUserProfile);

export default router;