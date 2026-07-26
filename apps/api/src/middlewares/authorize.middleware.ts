/*
وده هيبقى شغله:
authorize("admin")
لو المستخدم Admin → ✅
لو User → 403 Forbidden ❌
*/
import { Request, Response, NextFunction } from "express";

export const authorize = (...roles: string[]) => (req: Request, res: Response, next: NextFunction) => {
  console.log(req.user.role)
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({
      message: "Forbidden"
    })
  };

  next();
};

