import mongoose from "mongoose";
import { devConfig } from "../config/env/dev.config";

export function connectDB() {
  // Database connection logic here
  mongoose
    .connect(devConfig.DB_URL as string)
    .then(() => {
      console.log("MongoDB connected successfully");
    })
    .catch((error: any) => {
      console.error("MongoDB connection error:", error);
    });
}
