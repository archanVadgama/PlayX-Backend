import express from "express";
import { checkLogin } from "../middleware/authCheck.js";
import { DashboardController } from "../controller/admin/dashboardController.js";

const router = express.Router();

// [PROTECTED] Dashboard route
router.get("/dashboard", checkLogin, DashboardController.dashboard);

export default router;
