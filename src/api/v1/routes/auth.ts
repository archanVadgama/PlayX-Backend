import express from "express";
import { checkSchema } from "express-validator";
import { logInSchema, signUpSchema } from "../validation/auth.js";
import { checkLogin } from "../middleware/authCheck.js";
import { AuthController } from "../controller/authController.js";
import { DashboardController } from "../controller/dashboardController.js";

const router = express.Router();

// [OPEN] Login and signup route 
router.get("/login", checkSchema(logInSchema), AuthController.logInHandler);
router.post("/sign-up", checkSchema(signUpSchema), AuthController.signUpHandler);

// [PROTECTED] Dashboard route
router.get("/dashboard", checkLogin, DashboardController.dashboard);

export default router;