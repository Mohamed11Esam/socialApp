"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenBlacklist = void 0;
exports.generateToken = generateToken;
exports.verifyToken = verifyToken;
const jwt = __importStar(require("jsonwebtoken"));
const mongoose_1 = require("mongoose");
const dev_config_1 = require("../../config/env/dev.config");
const JWT_SECRET = dev_config_1.devConfig.JWT_SECRET || "change_this_secret";
function generateToken(userId, expiresIn) {
    return jwt.sign({ sub: userId }, JWT_SECRET, { expiresIn });
}
function verifyToken(token) {
    return jwt.verify(token, JWT_SECRET);
}
// simple TokenBlacklist model to store refresh tokens (or revoked tokens)
const tokenSchema = new mongoose_1.Schema({
    token: { type: String, required: true },
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String },
}, { timestamps: true });
exports.TokenBlacklist = (0, mongoose_1.model)("TokenBlacklist", tokenSchema);
