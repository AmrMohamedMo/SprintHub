import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { AppError } from "../errors/AppError.js";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof ZodError) {
    return res.status(400).json({
      message: "Validation faild",
      errors: err.issues
    })
  }
  
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      message: err.message,
    });
  };
  
  console.log(err);

  return res.status(500).json({
    message: "internal server Error"
  })
}