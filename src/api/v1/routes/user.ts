import express from "express";
import { checkSchema } from "express-validator";
import { UserController } from "../controller/user/userController.js";
import { VideoController } from "../controller/user/videoController.js";
import { checkLogin } from "../middleware/authCheck.js";
import { uploadFields } from "../middleware/multer.js";
import { uploadVideoSchema } from "../validation/user.js";

const router = express.Router();

// [OPEN Routes]
router.get("/:username/video/:filename", VideoController.videoStream);
router.get("/:username/thumbnail/:filename", VideoController.getThumbnail);
router.get("/feed", VideoController.getFeedData);
router.get("/watch/:uuid", VideoController.getVideo);

// [PROTECTED Routes]
router.get("/user/:id", checkLogin, UserController.getUser);
router.post(
  "/upload-video",
  checkLogin,
  uploadFields,
  checkSchema(uploadVideoSchema),
  VideoController.uploadVideo
);
// router.patch("/user/:id", checkLogin, UserController.updateUser);

export default router;
