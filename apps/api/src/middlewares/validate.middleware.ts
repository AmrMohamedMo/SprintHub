import { Request, Response, NextFunction } from "express";
import { ZodType } from "zod";

export const validate = (schema: ZodType) =>
  (req: Request, res: Response, next: NextFunction) => {
    req.body = schema.parse(req.body);
    next();
}