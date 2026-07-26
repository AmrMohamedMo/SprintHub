import "dotenv/config";

import { connectDatabase } from "./config/database.js";

if (!process.env.PORT) {
  throw new Error("PORT is not defined");
};

if (!process.env.MONGODB_URI) {
  throw new Error("MONGODB_URI is not defined");
};

await connectDatabase(process.env.MONGODB_URI);

import "./server.js";
