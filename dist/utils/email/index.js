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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMail = sendMail;
const nodemailer_1 = __importDefault(require("nodemailer"));
const dev_config_1 = require("../../config/env/dev.config");
function sendMail(_a) {
    return __awaiter(this, arguments, void 0, function* ({ to, subject, html }) {
        let transporter;
        let testAccount;
        try {
            if (dev_config_1.devConfig.EMAIL_USER && dev_config_1.devConfig.EMAIL_PASS) {
                transporter = nodemailer_1.default.createTransport({
                    host: "smtp.gmail.com",
                    port: 587,
                    secure: false, // STARTTLS
                    auth: {
                        user: dev_config_1.devConfig.EMAIL_USER,
                        pass: dev_config_1.devConfig.EMAIL_PASS,
                    },
                });
            }
            else {
                // Fallback to Ethereal test account for development when credentials are missing
                testAccount = yield nodemailer_1.default.createTestAccount();
                transporter = nodemailer_1.default.createTransport({
                    host: "smtp.ethereal.email",
                    port: 587,
                    secure: false,
                    auth: {
                        user: testAccount.user,
                        pass: testAccount.pass,
                    },
                });
                console.warn("EMAIL_USER/EMAIL_PASS not set — using Ethereal test account for outgoing mail (development only)");
            }
            if (!transporter)
                throw new Error("No mail transporter available");
            const info = yield transporter.sendMail({
                from: `socialApp <${dev_config_1.devConfig.EMAIL_USER || (testAccount && testAccount.user)}>`,
                to,
                subject,
                html,
            });
            // If using Ethereal, log preview URL and return it for tests
            const preview = nodemailer_1.default.getTestMessageUrl(info);
            if (preview) {
                console.log("Preview email URL:", preview);
            }
            return { info, preview };
        }
        catch (err) {
            // eslint-disable-next-line no-console
            console.error("sendMail error:", err);
            throw err;
        }
    });
}
