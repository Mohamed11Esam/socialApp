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
const errors_1 = require("../../utils/errors");
const DB_1 = require("../../DB");
const index_1 = require("./factory/index");
const utils_1 = require("../../utils");
const utils_2 = require("../../utils");
const utils_3 = require("../../utils");
const utils_4 = require("../../utils");
class AuthService {
    constructor() {
        // Define your authentication-related methods here
        this.userRepository = new DB_1.UserRepository();
        this.authFactory = new index_1.AuthFactory();
        // Initialize any required dependencies here
    }
    register(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const registerDto = req.body;
            const userExist = yield this.userRepository.getOne({ email: registerDto.email }, {}, {}); // Check if user already exists
            if (userExist) {
                throw new errors_1.ConflictException("User already exists");
            }
            const user = yield this.authFactory.register(registerDto);
            const savedUser = yield this.userRepository.create(user);
            return res.status(201).json({
                message: "User registered successfully",
                user: savedUser,
                success: true,
            });
        });
    }
    verifyOtp(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const verifyOtpDto = req.body;
            const user = yield this.userRepository.getOne({ email: verifyOtpDto.email }, {}, {});
            if (!user) {
                throw new errors_1.NotFoundException("User not found");
            }
            if (user.isVerified) {
                return res
                    .status(200)
                    .json({ message: "User already verified", success: true });
            }
            // validate OTP
            if (!user.otp || user.otp !== verifyOtpDto.otp) {
                throw new errors_1.UnauthorizedException("Invalid OTP");
            }
            // check expiry
            if (!user.otpExpiresAt || new Date(user.otpExpiresAt) < new Date()) {
                throw new errors_1.UnauthorizedException("OTP expired");
            }
            // mark user as verified and clear otp fields
            yield this.userRepository.update({ email: verifyOtpDto.email }, { isVerified: true, otp: null, otpExpiresAt: null });
            return res
                .status(200)
                .json({ message: "OTP verified successfully", success: true });
        });
    }
    resendOtp(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email } = req.body;
            if (!email) {
                throw new errors_1.NotFoundException("Email is required");
            }
            const user = yield this.userRepository.getOne({ email }, {}, {});
            if (!user) {
                throw new errors_1.NotFoundException("User not found");
            }
            if (user.isVerified) {
                return res
                    .status(200)
                    .json({ message: "User already verified", success: true });
            }
            const otp = (0, utils_2.generateOtp)();
            const otpExpiresAt = (0, utils_2.generateOtpExpiry)(10); // 10 minutes
            yield this.userRepository.update({ email }, { otp, otpExpiresAt });
            if (email) {
                yield (0, utils_1.sendMail)({
                    to: email,
                    subject: "Your OTP code",
                    html: `<p>Your new verification code is: <strong>${otp}</strong></p>`,
                });
            }
            return res.status(200).json({ message: "OTP resent", success: true });
        });
    }
    login(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const loginDto = req.body;
            const userExists = yield this.userRepository.getOne({
                $or: [
                    {
                        $and: [
                            { email: { $ne: null } },
                            { email: { $exists: true } },
                            { email: loginDto.email },
                        ],
                    },
                    {
                        $and: [
                            { phone: { $ne: null } },
                            { phone: { $exists: true } },
                            { phone: loginDto.phone },
                        ],
                    },
                ],
            }, {}, {});
            if (!userExists) {
                throw new errors_1.ForbiddenException("invalid credentials");
            }
            const isMatch = (0, utils_3.compareHash)(loginDto.password, userExists.password);
            if (!isMatch) {
                throw new errors_1.ForbiddenException("invalid credentials");
            }
            const accessToken = (0, utils_4.generateToken)(userExists._id, "1h");
            const refreshToken = (0, utils_4.generateToken)(userExists._id, "7d");
            const payload = this.authFactory.loginResponse(accessToken, refreshToken);
            return res.status(200).json({
                message: "Login successful",
                success: true,
                data: payload,
            });
        });
    }
}
exports.default = new AuthService();
