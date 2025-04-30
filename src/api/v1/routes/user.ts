import express from "express";
import { checkLogin } from "../middleware/authCheck.js";
import { UserController } from "../controller/user/userController.js";
import { uploadFields } from "../middleware/multer.js";
import { checkSchema } from "express-validator";
import { uploadVideoSchema } from "../validation/user.js";

const router = express.Router();

// [OPEN Routes]
router.get("/feed", UserController.getFeedData);
router.get("/watch/:uuid", UserController.getVideo);

// [PROTECTED Routes]
router.get("/user/:id", checkLogin, UserController.getUser);
router.post(
  "/upload-video",
  checkLogin,
  uploadFields,
  checkSchema(uploadVideoSchema),
  UserController.uploadVideo
);
// router.patch("/user/:id", checkLogin, UserController.updateUser);

export default router;
