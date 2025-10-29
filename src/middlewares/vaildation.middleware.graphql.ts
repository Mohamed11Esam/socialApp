import { NextFunction, Request, Response } from "express";
import { ZodSchema } from "zod/v3";
import { badRequestException } from "../utils/errors";
import { ZodType } from "zod";

export const isValidGraphQL = (schema: ZodType,args: any) => {
    const validation = schema.safeParse(args);
    if (validation.success === false) {
      let errorMessage = validation.error.issues.map((issue) => ({
        path: issue.path[0] as string,
        message: issue.message,
      }));

      throw new badRequestException("validation error", errorMessage);
    }
    // validation passed -> continue to next middleware / route handler

};
