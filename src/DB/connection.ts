
import mongoose from "mongoose"
export function connectDB() {
  // Database connection logic here
  mongoose.connect(process.env.DB_URL as string)
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((error:any) => {
    console.error("MongoDB connection error:", error);
  });
}
