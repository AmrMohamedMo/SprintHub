import "dotenv/config";

import { connectDatabase } from "./config/database.js";

if (!process.env.PORT) {
  throw new Error("PORT is not defined");
};

if (!process.env.MONGODB_URI) {
  throw new Error("MONGODB_URI is not defined");
};

/*
const PORT = process.env.PORT;
const MONGODB_URI = process.env.MONGODB_URI;

async function bootstrap() {
  await connectDatabase(MONGODB_URI);

  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  })
}
bootstrap();
*/

await connectDatabase(process.env.MONGODB_URI);

import "./server.js";
