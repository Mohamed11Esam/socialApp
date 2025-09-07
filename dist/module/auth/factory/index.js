"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthFactory = void 0;
const enums_1 = require("../../../utils/enums");
const hash_1 = require("../../../utils/hash");
const otp_1 = require("../../../utils/otp");
const entity_1 = require("../entity");
class AuthFactory {
    register(data) {
        const user = new entity_1.User();
        user.email = data.email;
        user.password = (0, hash_1.generateHash)(data.password);
        user.role = enums_1.ROLE.USER;
        user.gender = data.gender;
        user.userAgent = enums_1.USER_AGENT.LOCAL;
        user.otp = (0, otp_1.generateOtp)();
        user.otpExpiresAt = (0, otp_1.generateOtpExpiry)(10);
        return user;
    }
    loginResponse(user, accessToken, refreshToken) {
        return {
            user,
            accessToken,
            refreshToken
        };
    }
}
exports.AuthFactory = AuthFactory;
