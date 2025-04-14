export { };
enum ResponseCategory {
    SUCCESS = "success",
    AUTH = "auth",
    TOKEN = "token",
    ERROR = "error",
    DATABASE = "database",
  }

declare global {
  interface ILogIn {
    username: string;
    password: string;
    rememberMe: boolean;
  }

  interface ISigUp extends ILogIn {
    displayName: string;
    mobileNumber: number;
    email: string;
  }

  interface IPrismaError {
    name: string;
    code: string;
    message: string;
    meta?: {
      target?: string[];
    };
  }

  interface IResponseCode {
    status: boolean;
    message: string;
  }

  interface JWTPayload {
    id: string;
    username: string;
    isAdmin: boolean;
  }

  type ResponseCodeMap = Record<ResponseCategory, Record<string, IResponseCode>>;
}
