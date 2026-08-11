import jwt from 'jsonwebtoken'
import { env } from '../config/env.js'
// import { IUser } from '../models/user.model.js'


// Generate a short-lived - Access Token -
export const generateAccessToken = (
  userId: string, email: string, role: "user" | "admin") => {
  return jwt.sign(
    {
      userId,
      email,
      role
    },
    env.jwtSecret,
    {
      expiresIn: "7d"
    }
  );
};



// Verify a Refresh JWT
export const verifyRefreshToken = (
  refreshToken: string ) => {
  return jwt.verify(
    refreshToken,
    env.jwtSecret
  ) as {
    sub: string,
    sid: string
  }
}