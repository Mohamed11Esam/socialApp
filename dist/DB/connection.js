"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = connectDB;
const mongoose_1 = __importDefault(require("mongoose"));
function connectDB() {
    // Database connection logic here
    mongoose_1.default.connect(process.env.DB_URL)
        .then(() => {
        console.log("MongoDB connected successfully");
    })
        .catch((error) => {
        console.error("MongoDB connection error:", error);
    });
}
