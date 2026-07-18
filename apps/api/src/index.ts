import "dotenv/config";

if (!process.env.PORT) {
  throw new Error("PORT is not defined");
};

import "./server.js";