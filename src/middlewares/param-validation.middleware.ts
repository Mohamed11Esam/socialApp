import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";
import { badRequestException } from "../utils/errors";

export const isValidParams = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.params);
      next();
    } catch (error: any) {
      throw new badRequestException("Validation error", error.errors);
    }
  };
};
