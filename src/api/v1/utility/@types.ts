export {};
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
  interface IResetPassword {
    resetToken: string;
    password: string;
    confirmPassword: string;
  }
  interface IForgotPassword {
    email: string;
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
  interface UserPayload {
    image?: string;
    username: string;
    displayName: string;
    channelName?: string;
    bio?: string;
    email: string;
    mobileNumber: number;
    password: string;
    landmark?: string;
    addressLine1?: string;
    addressLine2?: string;
    countryId?: number;
    stateId?: number;
    cityId?: number;
  }

  interface UploadVideo {
    userId: number;
    categoryId: string;
    isAgeRestricted: boolean;
    isPrivate: boolean;
    thumbnailPath: string;
    videoPath: string;
    title: string;
    description: string;
    keywords: string;
    size: string;
    duration: string;
  }
  export interface VideoUser {
    username: string;
    displayName: string;
    channelName: string;
    image: string;
  }

  export interface Video {
    profileImg: string;
    userId: number;
    uuid: string;
    title: string;
    duration: number;
    channelName: string;
    viewCount: string;
    createdAt: string;
    thumbnailPath: string;
    videoPath: string;
    user: VideoUser;
  }
  type ResponseCodeMap = Record<ResponseCategory, Record<string, IResponseCode>>;
}
