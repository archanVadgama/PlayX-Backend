import jwt from "jsonwebtoken";
import "dotenv/config";
const ENV = process.env;
const JWT_SECRET = ENV.JWT_SECRET;
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
     * @param {object} user
     * @return {*}  {string}
     * @memberof JWTAuth
     */
    static setToken(user) {
        if (!JWT_SECRET) {
            throw new Error("JWT_SECRET is not defined");
        }
        return jwt.sign(user, JWT_SECRET);
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
    static getToken(token) {
        if (!JWT_SECRET) {
            throw new Error("JWT_SECRET is not defined");
        }
        try {
            // Verify the token using the secret key
            const decoded = jwt.verify(token, JWT_SECRET);
            return { status: true, msg: decoded };
        }
        catch (err) {
            // Handle different JWT errors  
            let errorMessage;
            if (err instanceof jwt.TokenExpiredError) {
                switch (err.name) {
                    case "TokenExpiredError":
                        errorMessage = "Token has expired";
                        break;
                    case "JsonWebTokenError":
                        errorMessage = "Invalid token";
                        break;
                    case "NotBeforeError":
                        errorMessage = "Token not active";
                        break;
                    default:
                }
            }
            else {
                errorMessage = "An unknown error occurred";
            }
            return { status: false, msg: errorMessage };
        }
    }
}
//# sourceMappingURL=jwtAuth.js.map