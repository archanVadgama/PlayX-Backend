import { Request, Response, RequestHandler } from "express";
import { validationResult } from "express-validator";
import { ResponseCategory } from "../../utility/response-code.js";
import { apiResponse, getHashPassword, verifyPassword } from "../../utility/helper.js";
import { StatusCodes } from "http-status-codes";
import { JWTAuth } from "../../utility/jwtAuth.js";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface ILogIn {
    userName: string;
    password: string;
}

interface ISigUp extends ILogIn {
    fullName: string;
    mobileNumber: number;
    email: string;
}

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
    static readonly logInHandler: RequestHandler = async (
        req: Request,
        res: Response
    ): Promise<void> => {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            res.status(StatusCodes.BAD_REQUEST)
                .json(apiResponse(ResponseCategory.ERROR, "validationFailed", result.formatWith((msg) => msg.msg).mapped()));
            return;
        }

        const { userName, password }: ILogIn = req.body;
        
        try {
            // Check if the user exists
            const getUser = await prisma.user.findFirst({ where: { userName } });

            // If user not found, return error response
            if (!getUser || typeof getUser.password !== "string") {
                res.status(StatusCodes.BAD_REQUEST)
                    .json(apiResponse(ResponseCategory.AUTH, "userNotExists"));
                return;
            }

            // Verify the password if not correct password return error response
            const hashedPassword = await verifyPassword(getUser.password, password);

            if (!hashedPassword) {
                res
                    .status(StatusCodes.BAD_REQUEST)
                    .json(apiResponse(ResponseCategory.AUTH, "invalidCredentials"));
                return;
            }

            // Generate JWT token and set it in the cookie
            const JWT_TOKEN = JWTAuth.setToken({
                user_id: btoa(getUser.id.toString()),
            });

            res.cookie("userToken", JWT_TOKEN);
            res
                .status(StatusCodes.OK)
                .json(apiResponse(ResponseCategory.SUCCESS, "logIn", { token: JWT_TOKEN }));
        } catch (error) {
            res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json(apiResponse(ResponseCategory.ERROR, "unexpectedError", error));
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
    static readonly signUpHandler: RequestHandler = async (
        req: Request,
        res: Response
    ) => {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            res.status(StatusCodes.BAD_REQUEST)
                .json(apiResponse(ResponseCategory.ERROR, "validationFailed", result.formatWith((msg) => msg.msg).mapped()));
            return;
        }

        const { userName, password, fullName, mobileNumber, email }: ISigUp = req.body;
        
        // It will generate the hashed password 
        const hashedPassword = await getHashPassword(password);
        try {
            // It will store the user data in the database
            const signUp = await prisma.user.create({
                data: {
                    userName,
                    password: hashedPassword,
                    fullName,
                    mobileNumber,
                    email,
                },
            });

            if (signUp) {
                res
                    .status(StatusCodes.OK)
                    .json(apiResponse(ResponseCategory.SUCCESS, "signUp"));
            } else {
                res
                    .status(StatusCodes.INTERNAL_SERVER_ERROR)
                    .json(apiResponse(ResponseCategory.ERROR, "unexpectedError"));
            }
        } catch (error) {
            res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json(apiResponse(ResponseCategory.ERROR, "unexpectedError", error));
        }
    };
}
