"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuthenticated = void 0;
const utils_1 = require("../utils");
const DB_1 = require("../DB");
const errors_1 = require("../utils/errors");
const isAuthenticated = (req, _res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const authHeader = req.headers.authorization || "";
    // Expect header format: "Bearer <token>"
    if (!authHeader.startsWith("Bearer ")) {
        throw new errors_1.UnauthorizedException("Authorization header missing or malformed");
    }
    const token = (_a = authHeader.split(" ")[1]) === null || _a === void 0 ? void 0 : _a.trim();
    if (!token) {
        throw new errors_1.UnauthorizedException("Token missing");
    }
    let payload;
    try {
        payload = (0, utils_1.verifyToken)(token);
    }
    catch (_e) {
        throw new errors_1.UnauthorizedException("Invalid token");
    }
    // verify() may return a string or object; also support various id keys
    if (!payload || typeof payload === "string") {
        throw new errors_1.UnauthorizedException("Invalid token payload");
    }
    const userId = payload.sub || payload._id || payload.id;
    if (!userId) {
        throw new errors_1.UnauthorizedException("Invalid token payload");
    }
    const userRepository = new DB_1.UserRepository();
    const user = yield userRepository.getOne({ _id: userId }, {}, {});
    if (!user) {
        throw new errors_1.NotFoundException("User not found");
    }
    req.user = user;
    next();
});
exports.isAuthenticated = isAuthenticated;
