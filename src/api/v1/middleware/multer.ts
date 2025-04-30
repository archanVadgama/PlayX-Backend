import multer from "multer";
import path from "path";
import fs from "fs/promises";

const allowedVideoTypes = ["video/mp4"];
const allowedThumbnailTypes = ["image/jpeg", "image/png"];

// Define storage with async directory creation
const storage = multer.diskStorage({
  destination: async (_, __, cb) => {
    try {
      const uploadPath = "../../../uploads";
      await fs.mkdir(uploadPath, { recursive: true }); // Ensure the directory exists
      return cb(null, uploadPath);
    } catch (err) {
      return cb(err as Error | null, "");
    }
  },
  filename: (_, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname);
    return cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 500 * 1024 * 1024, // Max 500MB
  },
  fileFilter: (req, file, cb) => {
    if (file.fieldname === "video") {
      if (!allowedVideoTypes.includes(file.mimetype)) {
        return cb(new Error("Only MP4 video files are allowed"));
      }
    }
    if (file.fieldname === "thumbnail") {
      if (!allowedThumbnailTypes.includes(file.mimetype)) {
        return cb(new Error("Only JPEG or PNG thumbnails are allowed"));
      }
    }
    cb(null, true);
  },
});

export const uploadFields = upload.fields([
  { name: "video", maxCount: 1 },
  { name: "thumbnail", maxCount: 1 },
]);
