export enum ResponseCategory {
    SUCCESS = "success",
    AUTH = "auth",
    TOKEN = "token",
    ERROR = "error",
}

interface IResponseCode {
    status: boolean;
    message: string;
}

type ResponseCodeMap = Record<ResponseCategory, Record<string, IResponseCode>>;

/**
 * A categorized map of response codes with their statuses and messages.
 * Categories:
 * - SUCCESS: Represents successful operations.
 * - AUTH: Represents authentication-related errors.
 * - TOKEN: Represents token-related errors.
 * - ERROR: Represents general or unexpected errors.
 */
export const ResponseCodes: ResponseCodeMap = {
    [ResponseCategory.SUCCESS]: {
        dataFetched: { status: true, message: "Data Fetched Successfully" },
        signUp: { status: true, message: "SignUp Successfully" },
        logIn: { status: true, message: "LogIn Successfully" },
    },
    [ResponseCategory.AUTH]: {
        userNotFound: { status: false, message: "User Not Found" },
        userNotExists: { status: false, message: "Username Not Exists" },
        invalidCredentials: {
            status: false,
            message: "Invalid Username or Password",
        },
    },
    [ResponseCategory.TOKEN]: {
        invalidOrExpired: { status: false, message: "Token is Invalid or Expired" },
    },
    [ResponseCategory.ERROR]: {
        unexpectedError: { status: false, message: "Unexpected Error Occurs" },
        validationFailed: { status: false, message: "Validation Failed" },
    },
};
