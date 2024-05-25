import { Router } from "express";
import { validateUser, signup, login } from "../controllers/authController";
import { authMiddleware } from "../middlewares/authMiddleware";

const authRouter = Router();

authRouter.post("/signup", validateUser, signup);
authRouter.post("/login", login);
authRouter.get("/protected", authMiddleware, (req, res) => {
  res.status(200).json({ ok: true, message: "This is a protected route" });
});

export default authRouter;
