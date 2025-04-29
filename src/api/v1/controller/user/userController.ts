import { Request, Response, RequestHandler } from "express";
import { validationResult } from "express-validator";
import { StatusCodes } from "http-status-codes";
import { PrismaClient } from "@prisma/client";
import { prismaErrorHandler } from "../../utility/prismaErrorHandler.js";
import "dotenv/config";

const prisma = new PrismaClient();
const ENV = process.env;
const NODE_ENV = ENV.NODE_ENV;

// under development
export class UserController {
  /**
   * @description Get user by id
   *
   * @static
   * @param {Request} req
   * @param {Response} res
   * @type {RequestHandler}
   * @memberof UserController
   */
  static readonly getUser: RequestHandler = async (req: Request, res: Response) => {
    const userId = parseInt(req.params.id);
    if (isNaN(userId)) {
      res.status(StatusCodes.BAD_REQUEST).json(apiResponse(ResponseCategory.ERROR, "invalidUserId"));
      return;
    }
    try {
      const user = await prisma.user.findUnique({
        omit: { password: true },
        where: { id: userId, isAdmin: false },
      });

      if (!user) {
        res.status(StatusCodes.BAD_REQUEST).json(apiResponse(ResponseCategory.ERROR, "userNotFound"));
        return;
      }

      res.status(StatusCodes.OK).json(apiResponse(ResponseCategory.SUCCESS, "dataFetched", safeJson(user)));
    } catch (error) {
      throw new Error(prismaErrorHandler(error as IPrismaError));
    }
  };
}
