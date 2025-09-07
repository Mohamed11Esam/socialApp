"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateOtp = generateOtp;
exports.generateOtpExpiry = generateOtpExpiry;
function generateOtp() {
    return Math.floor(Math.random() * 99999 + 10000).toString();
}
function generateOtpExpiry(time) {
    // treat `time` as minutes for a usable OTP expiry window
    return new Date(Date.now() + time * 60 * 1000);
}
