import { Request, Response } from "express";
import { registerUser, loginUser } from "../services/auth.service.js";

export const register = async (req: Request, res: Response) => {
  const result = await registerUser(req.body);
  res.status(201).json(result)
}



export const login = async (req: Request, res: Response) => {
  const result = await loginUser(req.body);
  res.status(200).json(result)
}