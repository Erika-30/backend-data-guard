// src/api/controllers/authController.ts

import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import {
  createUser,
  validateUserCredentials,
} from "../../services/auth.service";
import { UserSchema } from "../../config/dbConfig";

const jwtSecret = process.env["JWT_SECRET"] || "your-secret-key";

export const validateUser = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const result = UserSchema.safeParse(req.body);
  if (!result.success) {
    return next({
      status: 400,
      message: "Validation Error",
      details: result.error.errors,
    });
  }
  req.body = result.data;
  next();
};

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await createUser(req.body);
    res
      .status(201)
      .json({ ok: true, message: "User created successfully", data: user });
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;
    const user = await validateUserCredentials(email, password);
    const payload = { user: user.id };
    const token = jwt.sign(payload, jwtSecret, { expiresIn: "1h" });
    res.json({ ok: true, message: "Login successful", token });
  } catch (error) {
    next(error);
  }
};

export const logout = async (_req: Request, res: Response) => {
  // lista de revocacion de tokens... por ver
  res.status(200).json({ ok: true, message: "Logout successful" });
};
