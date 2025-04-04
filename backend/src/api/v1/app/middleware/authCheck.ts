import { Request, Response, NextFunction } from "express";
import { JWTAuth } from "../../utility/jwtAuth.js"
import { ResponseCategory } from "../../utility/response-code.js";
import { apiResponse } from "../../utility/helper.js";
import { StatusCodes } from "http-status-codes";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

/**
 * Middleware to check if the user is logged in by verifying the JWT token.
 *
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 * @return {*} 
 */
export const checkLogin = async (req: Request, res: Response, next: NextFunction) => {

    if (!req.cookies?.userToken) {
        res.status(StatusCodes.BAD_REQUEST).json(apiResponse(ResponseCategory.TOKEN, "invalidOrExpired"));
    } else {
        const token = JWTAuth.getToken(req.cookies.userToken);
        try {
            if (token?.status && typeof token.msg === "object" && "user_id" in token.msg) {
                
                const userId = parseInt(atob(token.msg.user_id));
                const getUser = await prisma.user.findFirst({ where: { id: userId } });

                if (!getUser) {
                    res.status(StatusCodes.BAD_REQUEST).json(apiResponse(ResponseCategory.AUTH, "userNotFound"));
                    return    
                }
                return next();
            }
        } catch (error) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(apiResponse(ResponseCategory.ERROR, "unexpectedError", error));
        }
    }
}