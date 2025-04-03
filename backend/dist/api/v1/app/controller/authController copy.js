var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var _a;
import { validationResult } from "express-validator";
import { ResponseCategory } from "../../utility/response-code.js";
import { apiResponse, getHashPassword, verifyPassword } from "../../utility/helper.js";
import { StatusCodes } from "http-status-codes";
import { JWTAuth } from "../../utility/jwtAuth.js";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
export class AuthController {
}
_a = AuthController;
AuthController.logInHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = validationResult(req);
    if (!result.isEmpty()) {
        res.status(StatusCodes.BAD_REQUEST).json(apiResponse(ResponseCategory.ERROR, "validationFailed", result.formatWith((msg) => msg.msg).mapped()));
        return;
    }
    const { userName, password } = req.body;
    try {
        const getUser = yield prisma.user.findFirst({ where: { userName } });
        if (!getUser || typeof getUser.password !== "string") {
            res.status(StatusCodes.BAD_REQUEST).json(apiResponse(ResponseCategory.AUTH, "userNotExists"));
            return;
        }
        const hashedPassword = yield verifyPassword(getUser.password, password);
        if (!hashedPassword) {
            res.status(StatusCodes.BAD_REQUEST).json(apiResponse(ResponseCategory.AUTH, "invalidCredentials"));
            return;
        }
        const JWT_TOKEN = JWTAuth.setToken({ user_id: btoa(getUser.id.toString()) });
        console.log("userToken", JWT_TOKEN);
        res.cookie("userToken", JWT_TOKEN);
        res.status(StatusCodes.OK).json(apiResponse(ResponseCategory.SUCCESS, "logIn", { token: JWT_TOKEN }));
    }
    catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(apiResponse(ResponseCategory.ERROR, "unexpectedError", error));
    }
});
AuthController.signUpHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = validationResult(req);
    if (!result.isEmpty()) {
        res.status(StatusCodes.BAD_REQUEST).json(apiResponse(ResponseCategory.ERROR, "validationFailed", result.formatWith((msg) => msg.msg).mapped()));
        return;
    }
    const { userName, password, fullName, mobileNumber, email } = req.body;
    const hashedPassword = yield getHashPassword(password);
    try {
        const signUp = yield prisma.user.create({
            data: {
                userName,
                password: hashedPassword,
                fullName,
                mobileNumber,
                email,
            },
        });
        if (signUp) {
            res.status(StatusCodes.OK).json(apiResponse(ResponseCategory.SUCCESS, "signUp"));
        }
        else {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(apiResponse(ResponseCategory.ERROR, "unexpectedError"));
        }
    }
    catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(apiResponse(ResponseCategory.ERROR, "unexpectedError", error));
    }
});
//# sourceMappingURL=authController%20copy.js.map