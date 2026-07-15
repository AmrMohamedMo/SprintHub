import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

const app = express();

app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());


app.get("/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    service: "SprintHub API"
  });
});








export default app;