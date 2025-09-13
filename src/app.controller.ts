import { type Express } from "express";
import { jsonErrorHandler } from "./utils/errors";
import { connectDB } from "./DB";
import { authRouter ,userRouter } from "./module";
export default function bootstrap(app: Express, express: any) {
  app.use(express.json());
  connectDB();
  app.use("/auth", authRouter);
  app.use("/user",userRouter); 
  app.use("/{*dummy}", (req, res, next) => {
    res.status(404).json({ message: "Not Found", success: false });
  });
  // global error handler (must come last)
  app.use(jsonErrorHandler as any);
}
