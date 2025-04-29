import { Request, Response, RequestHandler } from "express";
import { validationResult } from "express-validator";
import { StatusCodes } from "http-status-codes";
import { JWTAuth } from "../utility/jwtAuth.js";
import { PrismaClient } from "@prisma/client";
import { prismaErrorHandler } from "../utility/prismaErrorHandler.js";
import "dotenv/config";
import { sendMail } from "../utility/sendMail.js";

const prisma = new PrismaClient();
const ENV = process.env;
const NODE_ENV = ENV.NODE_ENV;

/**
 * AuthController class handles user authentication
 *
 * @export
 * @class AuthController
 */
export class AuthController {
  /**
   * Handles user login
   *
   * @static
   * @param {Request} req
   * @param {Response} res
   * @type {RequestHandler}
   * @memberof AuthController
   */
  static readonly logInHandler: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json(
          apiResponse(
            ResponseCategory.ERROR,
            "validationFailed",
            result.formatWith((msg) => msg.msg).mapped()
          )
        );
      return;
    }

    const { username, password, rememberMe }: ILogIn = req.body;

    try {
      // Check if the user exists
      const getUser = await prisma.user.findFirst({ where: { username } });

      // If user not found, return error response
      if (!getUser || typeof getUser.password !== "string") {
        res.status(StatusCodes.BAD_REQUEST).json(apiResponse(ResponseCategory.ERROR, "userNotFound"));
        return;
      }

      // Verify the password if not correct password return error response
      const hashedPassword = await verifyPassword(getUser.password, password);

      if (!hashedPassword) {
        res.status(StatusCodes.BAD_REQUEST).json(apiResponse(ResponseCategory.AUTH, "invalidCredentials"));
        return;
      }

      const userJWTData: JWTPayload = {
        id: btoa(getUser.id.toString()),
        username: getUser.username,
        isAdmin: getUser.isAdmin,
      };

      // Generate JWT token and set it in the cookie
      const JWT_TOKEN = JWTAuth.generateToken(userJWTData, rememberMe);

      if (rememberMe) {
        // Store refresh token in database
        await prisma.refreshToken.create({
          data: {
            token: JWT_TOKEN.refreshToken,
            userId: getUser.id,
            expiredAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
          },
        });

        // Set refresh token as an HTTP-only cookie
        res.cookie("refreshToken", JWT_TOKEN.refreshToken, {
          httpOnly: true,
          secure: NODE_ENV === "production" ? true : false,
          sameSite: "strict",
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
        });
      }
      res.cookie("accessToken", JWT_TOKEN.accessToken, {
        httpOnly: false,
        secure: NODE_ENV === "production" ? true : false,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
      });

      res.status(StatusCodes.OK).json(apiResponse(ResponseCategory.SUCCESS, "logIn"));
    } catch (error) {
      logHttp("error", error);
      throw new Error(prismaErrorHandler(error as IPrismaError));
    }
  };

  /**
   * Handles user signup
   *
   * @static
   * @param {Request} req
   * @param {Response} res
   * @type {RequestHandler}
   * @memberof AuthController
   */
  static readonly signUpHandler: RequestHandler = async (req: Request, res: Response) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json(
          apiResponse(
            ResponseCategory.ERROR,
            "validationFailed",
            result.formatWith((msg) => msg.msg).mapped()
          )
        );
      return;
    }

    const { username, password, displayName, mobileNumber, email }: ISigUp = req.body;

    // It will generate the hashed password
    const hashedPassword = await getHashPassword(password);
    try {
      // It will store the user data in the database
      await prisma.user.create({
        data: {
          username,
          password: hashedPassword,
          displayName,
          mobileNumber,
          email,
        },
      });

      res.status(StatusCodes.CREATED).json(apiResponse(ResponseCategory.SUCCESS, "signUp"));
    } catch (error) {
      throw new Error(prismaErrorHandler(error as IPrismaError));
    }
  };

  /**
   * This will be used to generate the access token using refresh token and set it in the cookie.
   *
   * @static
   * @param {Request} req
   * @param {Response} res
   * @type {RequestHandler}
   * @memberof AuthController
   */
  static readonly refreshTokenHandler: RequestHandler = async (req: Request, res: Response) => {
    // This will be used to check if the access token is exists in cookie or not
    if (!req.cookies?.accessToken) {
      res.status(StatusCodes.BAD_REQUEST).json(apiResponse(ResponseCategory.TOKEN, "accessTokenNotFound"));

      // This will be used to check if the refresh token is exists in cookie or not
    } else if (!req.cookies?.refreshToken) {
      res.status(StatusCodes.BAD_REQUEST).json(apiResponse(ResponseCategory.TOKEN, "refreshTokenNotFound"));
    } else {
      const accessTokenCheck = JWTAuth.verifyToken(req.cookies.accessToken);

      // This is used to check if the access token is valid or not
      if (!accessTokenCheck.status) {
        try {
          // find the refresh token in the database
          const refreshToken = await prisma.refreshToken.findFirst({
            where: { token: req.cookies.refreshToken },
          });

          // This is used to redirect user to login page
          if (!refreshToken) {
            res
              .status(StatusCodes.BAD_REQUEST)
              .json(apiResponse(ResponseCategory.TOKEN, "refreshTokenNotFound"));
            return;
          }

          // Verify the refresh token
          const token = JWTAuth.verifyToken(req.cookies.refreshToken, true);

          if (token?.status && typeof token.msg === "object" && "id" in token.msg) {
            const userId: number = parseInt(atob(token.msg.id));
            const getUser = await prisma.user.findFirst({
              where: { id: userId },
            });

            if (!getUser || typeof getUser.password !== "string") {
              res.status(StatusCodes.BAD_REQUEST).json(apiResponse(ResponseCategory.ERROR, "userNotFound"));
              return;
            }

            const userJWTData: JWTPayload = {
              id: btoa(getUser.id.toString()),
              username: getUser.username,
              isAdmin: getUser.isAdmin,
            };

            // Generate new JWT access token and set it in the cookie
            const JWT_TOKEN = JWTAuth.generateToken(userJWTData);

            res.cookie("accessToken", JWT_TOKEN.accessToken, {
              httpOnly: false,
              secure: NODE_ENV === "production" ? true : false,
              sameSite: "strict",
              maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
            });

            res.status(StatusCodes.OK).json(apiResponse(ResponseCategory.SUCCESS, "accessTokenGenerated"));
          } else {
            res
              .status(StatusCodes.BAD_REQUEST)
              .json(apiResponse(ResponseCategory.TOKEN, token.msg as string, null));
          }
        } catch (error) {
          logHttp("error", error);

          res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json(apiResponse(ResponseCategory.ERROR, "unexpectedError", error));
        }
      } else {
        res.status(StatusCodes.OK).json(apiResponse(ResponseCategory.SUCCESS, "accessTokenValid"));
      }
    }
  };

  /**
   * It will be used to log out the user by clearing the accessToken and refreshToken cookies.
   *
   * @static
   * @param {Request} req
   * @param {Response} res
   * @type {RequestHandler}
   * @memberof AuthController
   */
  static readonly logOutHandler: RequestHandler = async (req: Request, res: Response) => {
    try {
      // Clear accessToken and refreshToken cookies
      res.clearCookie("accessToken", {
        httpOnly: true,
        secure: NODE_ENV === "production",
        sameSite: "strict",
      });
      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: NODE_ENV === "production",
        sameSite: "strict",
      });

      // Optionally, delete refresh token from DB
      if (req.cookies?.refreshToken) {
        await prisma.refreshToken.deleteMany({
          where: { token: req.cookies.refreshToken },
        });
      }

      res.status(StatusCodes.OK).json(apiResponse(ResponseCategory.SUCCESS, "logOut"));
    } catch (error) {
      logHttp("error", error);
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json(apiResponse(ResponseCategory.ERROR, "unexpectedError", error));
    }
  };

  /**
   * This will be used to send the password reset link to the user email.
   *
   * @static
   * @param {Request} req
   * @param {Response} res
   * @type {RequestHandler}
   * @memberof AuthController
   */
  static readonly forgotPasswordHandler: RequestHandler = async (req: Request, res: Response) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json(
          apiResponse(
            ResponseCategory.ERROR,
            "validationFailed",
            result.formatWith((msg) => msg.msg).mapped()
          )
        );
      return;
    }

    const { email }: IForgotPassword = req.body;

    try {
      // Check if the user exists
      const getUser = await prisma.user.findFirst({ where: { email } });

      // If user not found, return error response
      if (!getUser || typeof getUser.email !== "string") {
        res.status(StatusCodes.BAD_REQUEST).json(apiResponse(ResponseCategory.ERROR, "userNotFound"));
        return;
      }

      // Generate JWT token for password reset
      const JWT_TOKEN = JWTAuth.generateToken({ email: getUser.email });

      // Update the user with the reset token. This will be used to set the reset token in the database
      await prisma.user.update({
        where: { email },
        data: { resetToken: JWT_TOKEN.accessToken },
      });

      // This utility function will send the email to the user with the reset link
      sendMail(
        getUser.email,
        getUser.displayName,
        `${ENV.FRONTEND_URL}/reset-password/${JWT_TOKEN.accessToken}`
      );

      res.status(StatusCodes.CREATED).json(apiResponse(ResponseCategory.SUCCESS, "resetMailSent"));
    } catch (error) {
      logHttp("error", error);

      throw new Error(prismaErrorHandler(error as IPrismaError));
    }
  };

  /**
   * This will be used to reset the password of the user.
   *
   * @static
   * @param {Request} req
   * @param {Response} res
   * @type {RequestHandler}
   * @memberof AuthController
   */
  static readonly resetPasswordHandler: RequestHandler = async (req: Request, res: Response) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json(
          apiResponse(
            ResponseCategory.ERROR,
            "validationFailed",
            result.formatWith((msg) => msg.msg).mapped()
          )
        );
      return;
    }
    const { resetToken, password, confirmPassword }: IResetPassword = req.body;

    // Verify the refresh token
    try {
      const token = JWTAuth.verifyToken(resetToken);
      if (token?.status && typeof token.msg === "object" && "email" in token.msg) {
        const userEmail = token.msg.email;

        const getUser = await prisma.user.findFirst({
          where: { email: userEmail },
        });

        if (!getUser) {
          res.status(StatusCodes.BAD_REQUEST).json(apiResponse(ResponseCategory.ERROR, "userNotFound"));
          return;
        }

        if (getUser.resetToken !== resetToken) {
          res.status(StatusCodes.BAD_REQUEST).json(apiResponse(ResponseCategory.TOKEN, "invalidOrExpired"));
          return;
        }

        // It will generate the hashed password
        if (password !== confirmPassword) {
          res.status(StatusCodes.BAD_REQUEST).json(apiResponse(ResponseCategory.ERROR, "passwordNotMatch"));
        }
        
        const hashedPassword = await getHashPassword(password);

        // It will store the user data in the database
        await prisma.user.update({
          where: { email: userEmail },
          data: {
            password: hashedPassword,
            resetToken: null,
          },
        });

        res.status(StatusCodes.OK).json(apiResponse(ResponseCategory.SUCCESS, "passwordChanged"));
      } else {
        res
          .status(StatusCodes.BAD_REQUEST)
          .json(apiResponse(ResponseCategory.TOKEN, token.msg as string, null));
      }
    } catch (error) {
      logHttp("error", error);

      throw new Error(prismaErrorHandler(error as IPrismaError));
    }
  };
}
