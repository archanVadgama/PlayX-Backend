import { Request, Response, NextFunction, ErrorRequestHandler } from "express";

export const errorMiddleware: ErrorRequestHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  // your error logic
  res.status(500).json({
    status: false,
    message: err?.message || "Internal Server Error",
    data: null,
  });
};
