import { hash } from "argon2";
import { ResponseCodes, ResponseCategory } from "./response-code.js";

/**
 * This is the universal response format that will be used in the API. 
 *
 * @template TData
 * @param {ResponseCategory} category
 * @param {string} key
 * @param {(TData | null)} [data]
 * @return {*} 
 */
export const apiResponse = <TData>(
  category: ResponseCategory,
  key: string,
  data?: TData | null
) => {
  const responseCode = ResponseCodes[category]?.[key];

  if (!responseCode) {
    throw new Error(
      `Invalid response code key: ${key} for category: ${category}`
    );
  }

  return {
    status: responseCode.status,
    message: responseCode.message,
    data: data ?? null,
  };
};

/**
 * This function is used to hash a password using the argon2 algorithm.
 *
 * @param {string} password
 * @return {*}  {Promise<string>}
 */
export const getHashPassword = async (password: string): Promise<string> => {
  try {
    return await hash(password);
  } catch (err) {
    console.error(`Something went wrong: ${err}`);  
    return "false";
  }
};

/**
 * This function is used to verify a password against a hashed password using the argon2 algorithm.
 *
 * @param {string} hashedPassword
 * @param {string} plainPassword
 * @return {*}  {Promise<boolean>}
 */
export const verifyPassword = async (
  hashedPassword: string,
  plainPassword: string
): Promise<boolean> => {
  const { verify } = await import("argon2");
  try {
    return await verify(hashedPassword, plainPassword);
  } catch (err) {
    console.error(`Something went wrong: ${err}`);
    return false;
  }
};
