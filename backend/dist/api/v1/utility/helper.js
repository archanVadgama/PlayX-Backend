var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { hash } from "argon2";
import { ResponseCodes } from "./response-code.js";
/**
 * This is the universal response format that will be used in the API.
 *
 * @template TData
 * @param {ResponseCategory} category
 * @param {string} key
 * @param {(TData | null)} [data]
 * @return {*}
 */
export const apiResponse = (category, key, data) => {
    var _a;
    const responseCode = (_a = ResponseCodes[category]) === null || _a === void 0 ? void 0 : _a[key];
    if (!responseCode) {
        throw new Error(`Invalid response code key: ${key} for category: ${category}`);
    }
    return {
        status: responseCode.status,
        message: responseCode.message,
        data: data !== null && data !== void 0 ? data : null,
    };
};
/**
 * This function is used to hash a password using the argon2 algorithm.
 *
 * @param {string} password
 * @return {*}  {Promise<string>}
 */
export const getHashPassword = (password) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield hash(password);
    }
    catch (err) {
        console.error(`Something went wrong: ${err}`);
        return "false";
    }
});
/**
 * This function is used to verify a password against a hashed password using the argon2 algorithm.
 *
 * @param {string} hashedPassword
 * @param {string} plainPassword
 * @return {*}  {Promise<boolean>}
 */
export const verifyPassword = (hashedPassword, plainPassword) => __awaiter(void 0, void 0, void 0, function* () {
    const { verify } = yield import("argon2");
    try {
        return yield verify(hashedPassword, plainPassword);
    }
    catch (err) {
        console.error(`Something went wrong: ${err}`);
        return false;
    }
});
//# sourceMappingURL=helper.js.map