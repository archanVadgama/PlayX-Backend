var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { JWTAuth } from "../../utility/jwtAuth.js";
import { ResponseCategory } from "../../utility/response-code.js";
import { apiResponse } from "../../utility/helper.js";
import { StatusCodes } from "http-status-codes";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
/**
 * Middleware to check if the user is logged in by verifying the JWT token.
 *
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 * @return {*}
 */
export const checkLogin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (!((_a = req.cookies) === null || _a === void 0 ? void 0 : _a.userToken)) {
        res.status(StatusCodes.BAD_REQUEST).json(apiResponse(ResponseCategory.TOKEN, "invalidOrExpired"));
    }
    else {
        const token = JWTAuth.getToken(req.cookies.userToken);
        try {
            if ((token === null || token === void 0 ? void 0 : token.status) && typeof token.msg === "object" && "user_id" in token.msg) {
                const userId = parseInt(atob(token.msg.user_id));
                const getUser = yield prisma.user.findFirst({ where: { id: userId } });
                if (!getUser) {
                    res.status(StatusCodes.BAD_REQUEST).json(apiResponse(ResponseCategory.AUTH, "userNotFound"));
                    return;
                }
                return next();
            }
        }
        catch (error) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(apiResponse(ResponseCategory.ERROR, "unexpectedError", error));
        }
    }
});
//# sourceMappingURL=authCheck.js.map