import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import jwt from "jsonwebtoken";

export const errorMiddleware = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  console.error(err);

  if (err instanceof ZodError) {
    return res.status(400).json({
      ok: false,
      error: {
        message: "Validation error",
        details: err.errors.map((e) => e.message),
      },
    });
  }

  if (err.name === "UnauthorizedError") {
    return res.status(401).json({
      ok: false,
      error: {
        message: "Unauthorized",
        details: null,
      },
    });
  }

  if (err instanceof jwt.JsonWebTokenError) {
    return res.status(401).json({
      ok: false,
      error: {
        message: "Invalid token",
        details: null,
      },
    });
  }

  const status = err.status || 500;
  const message = err.message || "Internal Server Error";

  return res.status(status).json({
    ok: false,
    error: {
      message,
      details: err.details || null,
    },
  });
};
