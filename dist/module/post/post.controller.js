"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const post_service_1 = __importDefault(require("./post.service"));
const param_validation_middleware_1 = require("../../middlewares/param-validation.middleware");
const post_validation_1 = require("./post.validation");
const router = (0, express_1.Router)();
router.post("/create", auth_middleware_1.isAuthenticated, post_service_1.default.create);
router.patch("/:id", auth_middleware_1.isAuthenticated, (0, param_validation_middleware_1.isValidParams)(post_validation_1.getPostParamsSchema), post_service_1.default.addReaction);
exports.default = router;
