import app from "./app.js";
import { env } from "./config/env.js";

// const PORT = process.env.PORT || 5000;

app.listen(env.port, () => {
  console.log(`Server is running on port ${env.port}`);
});
