import jwt from "jsonwebtoken";
import "dotenv/config";

const ENV = process.env;

/**
 * JWT Authentication class to handle token generation and verification.
 *
 * @export
 * @class JWTAuth
 */
export class JWTAuth {
  /**
   * Generates a JWT token for the given user object.
   *
   * @static
   * @param {JWTPayload | IForgotPassword} user
   * @return {*}  {string}
   * @memberof JWTAuth
   */
  static generateToken(
    user: JWTPayload | IForgotPassword,
    refreshToken: boolean = false,
    resetPassword: boolean = false
  ): Record<string, string> {
    if (!ENV.JWT_SECRET || !ENV.JWT_TOKEN_TIME) {
      throw new Error("JWT_SECRET or JWT_TOKEN_TIME is not defined");
    }
    if (refreshToken && (!ENV.REFRESH_SECRET || !ENV.REFRESH_TOKEN_TIME)) {
      throw new Error("REFRESH_SECRET or REFRESH_TOKEN_TIME is not defined");
    }
    if (resetPassword && !ENV.RESET_TOKEN_TIME) {
      throw new Error("RESET_TOKEN_TIME is not defined");
    }
    const tokenDuration = resetPassword ? ENV.RESET_TOKEN_TIME : ENV.JWT_TOKEN_TIME;

    const accessToken = jwt.sign(user, ENV.JWT_SECRET, {
      expiresIn: tokenDuration as jwt.SignOptions["expiresIn"],
    });
    const tokens: Record<string, string> = { accessToken };

    if (refreshToken) {
      if (!ENV.REFRESH_SECRET) {
        throw new Error("REFRESH_SECRET is not defined");
      }
      const refreshTokenValue = jwt.sign(user, ENV.REFRESH_SECRET, {
        expiresIn: ENV.REFRESH_TOKEN_TIME as jwt.SignOptions["expiresIn"],
      });
      tokens.refreshToken = refreshTokenValue;
    }
    return tokens;
  }

  /**
   * Verifies the provided JWT token and returns the decoded payload or an error message.
   *
   * @static
   * @param {string} token
   * @return {*}  {({
   *     status: boolean;
   *     msg: string | jwt.JwtPayload | undefined;
   *   })}
   * @memberof JWTAuth
   */
  static verifyToken(
    token: string,
    refreshToken: boolean = false
  ): {
    status: boolean;
    msg: string | jwt.JwtPayload | undefined;
  } {
    if (!ENV.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined");
    }
    if (refreshToken && !ENV.REFRESH_SECRET) {
      throw new Error("REFRESH_SECRET is not defined");
    }
    try {
      const SECRET = refreshToken ? ENV.REFRESH_SECRET : ENV.JWT_SECRET;
      if (!SECRET) {
        throw new Error("SECRET key is not defined");
      }
      // Verify the token using the secret key
      const decoded = jwt.verify(token, SECRET);
      return { status: true, msg: decoded };
    } catch (error) {
      if (error instanceof Error) {
        return { status: false, msg: error.name };
      }
      return { status: false, msg: "UnknownError" };
    }
  }
}
