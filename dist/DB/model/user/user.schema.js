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
exports.userSchema = void 0;
const mongoose_1 = require("mongoose");
const enums_1 = require("../../../utils/enums");
const utils_1 = require("../../../utils");
exports.userSchema = new mongoose_1.Schema({
    firstName: { type: String, minLength: 2, maxLength: 50, trim: true },
    lastName: { type: String, minLength: 2, maxLength: 50, trim: true },
    email: { type: String, required: true, unique: true, trim: true },
    password: {
        type: String,
        required: function () {
            if (this.userAgent == enums_1.USER_AGENT.GOOGLE) {
                return false;
            }
            return true;
        },
        trim: true,
    },
    credentialUpdatedAt: { type: Date, default: Date.now },
    phone: { type: String },
    role: { type: String, enum: Object.values(enums_1.ROLE), default: enums_1.ROLE.USER },
    gender: { type: String, enum: Object.values(enums_1.GENDER), default: enums_1.GENDER.MALE },
    userAgent: {
        type: String,
        enum: Object.values(enums_1.USER_AGENT),
        default: enums_1.USER_AGENT.LOCAL,
    },
    otp: { type: String },
    otpExpiresAt: { type: Date },
    isVerified: { type: Boolean, default: false },
    accessToken: { type: String },
    refreshToken: { type: String },
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
    },
    toObject: {
        virtuals: true,
    },
});
exports.userSchema
    .virtual("fullName")
    .get(function () {
    return `${this.firstName} ${this.lastName}`;
})
    .set(function (fullName) {
    const [firstName, lastName] = fullName.split(" ");
    this.firstName = firstName;
    this.lastName = lastName;
});
exports.userSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (this.email && this.userAgent === enums_1.USER_AGENT.LOCAL && !this.isVerified) {
            yield (0, utils_1.sendMail)({
                to: this.email,
                subject: "Verification Email",
                html: `<p>Your verification code is: <strong>${this.otp}</strong></p>`,
            });
        }
    });
});
