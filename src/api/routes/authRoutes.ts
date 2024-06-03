// src/api/routes/authRoutes.ts

import { Router } from "express";
import {
  validateUser,
  signup,
  login,
  logout,
} from "../controllers/authController";
import { authMiddleware } from "../middlewares/authMiddleware";

const authRouter = Router();

authRouter.post("/signup", validateUser, signup);
authRouter.post("/login", login);
authRouter.post("/logout", authMiddleware, logout);
authRouter.get("/protected", authMiddleware, (_req, res) => {
  res.status(200).json({ ok: true, message: "This is a protected route" });
});

export default authRouter;
