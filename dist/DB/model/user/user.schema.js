"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userSchema = void 0;
const mongoose_1 = require("mongoose");
const enums_1 = require("../../../utils/enums");
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
    }
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
