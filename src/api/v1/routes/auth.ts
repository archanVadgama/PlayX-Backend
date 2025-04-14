import express from "express";
import { checkSchema } from "express-validator";
import { logInSchema, signUpSchema } from "../validation/auth.js";
import { AuthController } from "../controller/authController.js";

const router = express.Router();

// [OPEN] Login and signup route 
router.get("/log-in", checkSchema(logInSchema), AuthController.logInHandler);
router.post("/sign-up", checkSchema(signUpSchema), AuthController.signUpHandler);
router.get("/log-out", AuthController.logOutHandler);
router.get("/refresh-token", AuthController.refreshTokenHandler);

export default router;