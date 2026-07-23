import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export const authentication = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // token
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      message: "Unauthorized"
    });
  };

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      message: "Unauthorized"
    });
  };

  try {
    // const decoded = jwt.verify(token, env.jwtSecret);
    const decoded = jwt.verify(token, env.jwtSecret) as {
      userId: string,
      email:string
    }

    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid token"
    })
  }

}