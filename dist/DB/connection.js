"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = connectDB;
const mongoose_1 = __importDefault(require("mongoose"));
const dev_config_1 = require("../config/env/dev.config");
function connectDB() {
    // Database connection logic here
    mongoose_1.default
        .connect(dev_config_1.devConfig.DB_URL)
        .then(() => {
        console.log("MongoDB connected successfully");
    })
        .catch((error) => {
        console.error("MongoDB connection error:", error);
    });
}
