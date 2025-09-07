import { type Express } from "express";
import authRouter from "./module/auth/auth.controller";
import { jsonErrorHandler } from "./utils/errors";
import { connectDB } from "./DB/connection";

export default function bootstrap(app: Express, express: any) {
  app.use(express.json());
  connectDB();
  app.use("/auth", authRouter);
  app.use("/{*dummy}", (req, res, next) => {
    res.status(404).json({ message: "Not Found", success: false });
  });
  // global error handler (must come last)
  app.use(jsonErrorHandler as any);
}
