import express from "express";
import { checkSchema } from "express-validator";
import { logInSchema, signUpSchema } from "../app/validation/auth.js";
import { checkLogin } from "../app/middleware/authCheck.js";
import { AuthController } from "../app/controller/authController.js";
import { DashboardController } from "../app/controller/dashboardController.js";

const router = express.Router();

// [OPEN] Login and signup route 
router.get("/login", checkSchema(logInSchema), AuthController.logInHandler);
router.post("/sign-up", checkSchema(signUpSchema), AuthController.signUpHandler);

// [PROTECTED] Dashboard route
router.get("/dashboard", checkLogin, DashboardController.dashboard);

export default router;