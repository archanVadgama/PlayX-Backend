/**
 * String field validation
 *
 * @param {number} min
 * @param {number} max
 * @param {string} field
 */
const stringField = (min, max, field) => ({
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
const intField = (min, max, field) => ({
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
const emailField = {
    notEmpty: {
        errorMessage: "Email is required",
    },
    isEmail: {
        errorMessage: "Invalid email",
    },
};
/**
 * Schema definition for user login validation.
 */
const logInSchema = {
    userName: stringField(5, 20, "Username"),
    password: stringField(4, 12, "Password"),
};
/**
 * Schema definition for user sign-up validation.
 *
 * This schema extends the `logInSchema` and adds additional fields
 * required for user registration
 */
const signUpSchema = Object.assign(Object.assign({}, logInSchema), { fullName: stringField(5, 40, "Name"), mobileNumber: intField(10, 10, "Mobile Number"), email: emailField });
export { logInSchema, signUpSchema };
//# sourceMappingURL=auth.js.map