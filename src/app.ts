// src/app.ts

import express from "express";
import { config as configDotenv } from "dotenv";
import authRouter from "./api/routes/authRoutes";
import { errorMiddleware } from "./api/middlewares/errorMiddleware";
import uploadRouter from "./api/routes/uploadRoutes";
import cors from "cors";

if (process.env["NODE_ENV"] === "test") {
  configDotenv({ path: ".env.test" });
} else {
  configDotenv();
}

export const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", authRouter);
app.use("/user", uploadRouter);

app.use(errorMiddleware);

export default app;
