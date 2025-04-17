import express from "express";
import { checkLogin } from "../middleware/authCheck.js";
import { UserController } from "../controller/user/userController.js";

const router = express.Router();

// [PROTECTED] Update user route
router.get("/user/:id", checkLogin, UserController.getUser);
// router.patch("/user/:id", checkLogin, UserController.updateUser);

export default router;
