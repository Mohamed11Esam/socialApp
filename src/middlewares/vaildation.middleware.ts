import { NextFunction, Request, Response } from "express"
import { ZodSchema } from "zod/v3"
import { badRequestException } from "../utils/errors";
import { ZodType } from "zod";

export const isValid = (schema:ZodType) => {
    return (req:Request, res:Response, next:NextFunction) => {

        let data = {...req.body, ...req.params, ...req.query}
        const validation = schema.safeParse(data);
            if (validation.success === false) {
              let errorMessage = validation.error.issues.map((issue) => ({
                path: issue.path[0] as string,
                message: issue.message,
              }));
        
              throw new badRequestException("validation error", errorMessage);
            }
    }
}