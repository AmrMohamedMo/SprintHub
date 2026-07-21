import 'dotenv/config';

if (!process.env.PORT) {
  throw new Error("PORT is not defined");
};

if (!process.env.MONGODB_URI) {
  throw new Error("MONGODB_URI is not defined")
}
if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined")
}

export const env = {
  port: Number(process.env.PORT) || 5000,
  mongodbUri: process.env.MONGODB_URI,
  jwtSecret: process.env.JWT_SECRET,
};