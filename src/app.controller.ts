import { type Express } from "express";
import {createHandler} from 'graphql-http/lib/use/express'
import { jsonErrorHandler } from "./utils/errors";
import { connectDB } from "./DB";
import { authRouter, chatRouter, postRouter, userRouter } from "./module";
import publicCommentRouter from "./module/comment/public.controller";
import cors from "cors";
import { appSchema } from "./app.schema";
import { GraphQLError } from "graphql";
export default function bootstrap(app: Express, express: any) {
  app.use(express.json());
  connectDB();
  app.use(cors({ origin: "*" }));
  app.use("/auth", authRouter);
  app.use("/user", userRouter);
  app.use("/post", postRouter);
  // Public comment endpoints (e.g., GET /comment/:id)
  app.use("/comment", publicCommentRouter);
  app.use("/chat", chatRouter);
  app.all("/graphql",createHandler({
    schema: appSchema, // provide your GraphQL schema here // enable GraphiQL interface
    formatError: (error: GraphQLError) => {
      return {
        message: error.message,
      locations: error.locations,
      stack: error.stack,
      path: error.path,
      } as unknown as GraphQLError
    },
    context: (req) => {
      const token = req.headers["authorization"];
      return { token }
    }
  }))
  app.use("/{*dummy}", (req, res, next) => {
    res.status(404).json({ message: "Not Found", success: false });
  });
  // global error handler (must come last)
  app.use(jsonErrorHandler as any);
}
