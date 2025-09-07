"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_service_1 = __importDefault(require("./auth.service"));
const errors_1 = require("../../utils/errors");
const router = (0, express_1.Router)();
// bind and wrap so `this` is preserved and errors are forwarded to the JSON error handler
router.post("/register", (0, errors_1.asyncHandler)(auth_service_1.default.register.bind(auth_service_1.default)));
router.post("/verify-otp", (0, errors_1.asyncHandler)(auth_service_1.default.verifyOtp.bind(auth_service_1.default)));
router.post("/login", (0, errors_1.asyncHandler)(auth_service_1.default.login.bind(auth_service_1.default)));
exports.default = router;
