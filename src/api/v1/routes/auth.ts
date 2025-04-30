import express from "express";
import { checkSchema } from "express-validator";
import { logInSchema, signUpSchema, forgotPassSchema, resetPassSchema } from "../validation/auth.js";
import { AuthController } from "../controller/authController.js";

const router = express.Router();

// [OPEN] Login and signup route
router.post("/log-in", checkSchema(logInSchema), AuthController.logInHandler);
router.post("/sign-up", checkSchema(signUpSchema), AuthController.signUpHandler);
router.post("/forgot-password", checkSchema(forgotPassSchema), AuthController.forgotPasswordHandler);
router.post("/reset-password", checkSchema(resetPassSchema), AuthController.resetPasswordHandler);
router.post("/log-out", AuthController.logOutHandler);
router.get("/refresh-token", AuthController.refreshTokenHandler);

export default router;
