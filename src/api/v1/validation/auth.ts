import { Schema } from "express-validator";

type TStringField = (
  min: number,
  max: number,
  field: string
) => {
  [key: string]:
  | { errorMessage?: string; options?: { min: number; max: number } }
  | boolean;
};

type TIntField = (
  min: number,
  max: number,
  field: string
) => {
  [key: string]:
  | { errorMessage?: string; options?: { min: number; max: number } }
  | boolean;
};

/**
 * String field validation
 *
 * @param {number} min
 * @param {number} max
 * @param {string} field
 */
const stringField: TStringField = (
  min: number,
  max: number,
  field: string
) => ({
  notEmpty: {
    errorMessage: `${field} is required`,
  },
  isString: { errorMessage: `${field} should be string` },
  isLength: {
    options: { min, max },
    errorMessage: `${field} must be between ${min} to ${max} characters`,
  },
});

/**
 * Integer field validation
 *
 * @param {number} min
 * @param {number} max
 * @param {string} field
 */
const intField: TIntField = (min: number, max: number, field: string) => ({
  notEmpty: {
    errorMessage: `${field} is required`,
  },
  isInt: {
    errorMessage: `${field} will be a number`,
  },
  isLength: {
    options: { min, max },
    errorMessage: `${field} must be between ${min} to ${max} characters`,
  },
});

const emailField: { [key: string]: { errorMessage?: string } | boolean } = {
  notEmpty: {
    errorMessage: "Email is required",
  },
  isEmail: {
    errorMessage: "Invalid email",
  },
};

const rememberMe: { [key: string]: { errorMessage?: string } | boolean } = {
  notEmpty: {
    errorMessage: "Remember Me is required",
  },
  isBoolean: {
    errorMessage: "Remember Me should be a boolean value",
  },
};

const logInSchema: Schema = {
  username: stringField(5, 20, "Username"),
  password: stringField(4, 12, "Password"),
  rememberMe,
};

/**
 * Schema definition for user sign-up validation.
 *
 * This schema extends the `logInSchema` and adds additional fields
 * required for user registration
 */
const signUpSchema: Schema = {
  ...logInSchema,
  displayName: stringField(5, 40, "Name"),
  mobileNumber: intField(10, 10, "Mobile Number"),
  email: emailField,
};


export { logInSchema, signUpSchema };
