export enum ResponseCategory {
  SUCCESS = "success",
  AUTH = "auth",
  TOKEN = "token",
  ERROR = "error",
  DATABASE = "database",
}

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
    resetMailSent: { status: true, message: "Password Reset Mail Sent" },
    logOut: { status: true, message: "LogOut Successfully" },
    passwordChanged: { status: true, message: "Password Changed Successfully" },
    accessTokenGenerated: {
      status: true,
      message: "New Access Token Generated",
    },
    accessTokenValid: { status: true, message: "Access Token not expired" },
    videoUploaded: { status: true, message: "Video Uploaded Successfully" },
  },
  [ResponseCategory.AUTH]: {
    invalidCredentials: {
      status: false,
      message: "Invalid Username or Password",
    },
  },
  [ResponseCategory.TOKEN]: {
    UnknownError: { status: false, message: "Unknown Token Error" },
    TokenExpiredError: { status: false, message: "Token is Expired" },
    JsonWebTokenError: { status: false, message: "Invalid Token" },
    NotBeforeError: { status: false, message: "Token not active" },
    invalidOrExpired: { status: false, message: "Token is Invalid or Expired" },
    accessTokenNotFound: { status: false, message: "Access Token Not Found" },
    refreshTokenNotFound: { status: false, message: "Refresh Token Not Found" },
  },
  [ResponseCategory.DATABASE]: {
    database: { status: false, message: "Database error" },
  },
  [ResponseCategory.ERROR]: {
    unexpectedError: { status: false, message: "Unexpected Error Occurs" },
    validationFailed: { status: false, message: "Validation Failed" },
    userNotFound: { status: false, message: "User Not Found" },
    videoNotFound: { status: false, message: "Video Not Found" },
    dataNotFound: { status: false, message: "Data Not Found" },
    invalidUserId: { status: false, message: "Invalid User Id" },
    invalidVideoId: { status: false, message: "Invalid Video Id" },
    passwordNotMatch: { status: false, message: "Password and Confirm password not match." },
    missingFiles: { status: false, message: "File is Missing" },
    invalidThumbnailSize: { status: false, message: "Thumbnail size is invalid" },
    thumbnailTooLarge: { status: false, message: "Maximum Thumbnail size is 2MB" },
    videoTooLarge: { status: false, message: "Maximum Video size is 500MB" },
    videoUploadFailed: { status: false, message: "Video Upload Failed" },
    videoIsRequired: { status: false, message: "Video is Required" },
    thumbnailIsRequired: { status: false, message: "Thumbnail is Required" },
  },
};
