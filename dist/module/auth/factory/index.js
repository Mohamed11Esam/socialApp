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
exports.AuthFactory = void 0;
const enums_1 = require("../../../utils/enums");
const hash_1 = require("../../../utils/hash");
const otp_1 = require("../../../utils/otp");
const entity_1 = require("../entity");
class AuthFactory {
    register(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = new entity_1.User();
            user.email = data.email;
            user.password = yield (0, hash_1.generateHash)(data.password);
            user.role = enums_1.ROLE.USER;
            user.gender = data.gender;
            user.userAgent = enums_1.USER_AGENT.LOCAL;
            user.otp = (0, otp_1.generateOtp)();
            user.otpExpiresAt = (0, otp_1.generateOtpExpiry)(10);
            return user;
        });
    }
    loginResponse(accessToken, refreshToken) {
        return {
            accessToken,
            refreshToken
        };
    }
}
exports.AuthFactory = AuthFactory;
