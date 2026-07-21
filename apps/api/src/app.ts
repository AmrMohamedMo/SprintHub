import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
// import healthRouter from './routes/health.route.js';
import router from './routes/index.js';
import { notFound } from "./middlewares/not-found.middleware.js";
import { errorHandler } from "./middlewares/error.middleware.js";
// import authRouter from './routes/auth.route.js';
const app = express();

app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());


// app.use("/health", healthRouter);
// app.use("/auth", authRouter);
app.use(router);

app.use(notFound);
app.use(errorHandler);

export default app;