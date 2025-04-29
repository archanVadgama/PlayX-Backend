import { asyncLocalStorage } from "../utility/logger.js";
import { Request, Response, NextFunction } from "express";

/**
 * Middleware to create a request context for logging
 *
 * @export
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
export function requestContext(req: Request, res: Response, next: NextFunction) {
  asyncLocalStorage.run({ method: req.method, url: req.originalUrl }, () => {
    next();
  });
}
