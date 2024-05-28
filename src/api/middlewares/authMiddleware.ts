// src/api/middlewares/authMiddleware.ts

import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User } from "../../config/dbConfig";

const jwtSecret = process.env["JWT_SECRET"] || "your-secret-key";

interface AuthenticatedRequest extends Request {
  user?: User;
}

export const authMiddleware = (
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return next({ status: 401, message: "No token provided" });
  }

  const parts = authHeader.split(" ");

  if (parts.length !== 2) {
    return next({ status: 401, message: "Token error" });
  }

  const [scheme, token] = parts;

  if (!/^Bearer$/i.test(scheme)) {
    return next({ status: 401, message: "Token malformatted" });
  }

  jwt.verify(token, jwtSecret, (err, decoded) => {
    if (err) {
      return next({ status: 401, message: "Invalid token" });
    }

    req.user = decoded as User;
    next();
  });
};
