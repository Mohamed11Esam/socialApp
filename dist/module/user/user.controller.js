"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_service_1 = __importDefault(require("./user.service"));
const utils_1 = require("../../utils");
const param_validation_middleware_1 = require("../../middlewares/param-validation.middleware");
const user_validation_1 = require("./user.validation");
const router = (0, express_1.Router)();
router.get("/profile/:userId", (0, param_validation_middleware_1.isValidParams)(user_validation_1.getUserProfileSchema), (0, utils_1.asyncHandler)(user_service_1.default.getUserProfile));
exports.default = router;
