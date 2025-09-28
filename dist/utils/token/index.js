"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = generateToken;
exports.verifyToken = verifyToken;
const jsonwebtoken_1 = require("jsonwebtoken");
const dev_config_1 = require("../../config/env/dev.config");
const JWT_SECRET = dev_config_1.devConfig.JWT_SECRET || "change_this_secret";
function generateToken(userId, expiresIn) {
    return (0, jsonwebtoken_1.sign)({ sub: userId }, JWT_SECRET, { expiresIn });
}
function verifyToken(token) {
    return (0, jsonwebtoken_1.verify)(token, JWT_SECRET);
}
// simple TokenBlacklist model to store refresh tokens (or revoked tokens)
