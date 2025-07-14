import { PutObjectCommand } from "@aws-sdk/client-s3";
import fs from "fs";
import { s3Client } from "../config/aws.js";
import { Response } from "express";
import "dotenv/config";
import path from "path";

const ENV = process.env;

interface S3UploadPaths {
  thumbnailDB: string;
  thumbnail: string;
  videoDB: string;
  video: string;
}

export const storeFilesInS3 = async (
  res: Response,
  username: string,
  paths: S3UploadPaths,
  video: Express.Multer.File,
  thumbnail: Express.Multer.File
): Promise<void> => {
  try {
    const thumbnailStats = await fs.promises.stat(thumbnail.path);
    if (thumbnailStats.size > 20 * 1024 * 1024) {
      res.status(400).json(apiResponse(ResponseCategory.ERROR, "thumbnailTooLarge"));
      return;
    }

    const thumbnailStream = fs.createReadStream(thumbnail.path);
    const videoStream = fs.createReadStream(video.path);

    // Upload thumbnail
    await s3Client.send(
      new PutObjectCommand({
        Bucket: ENV.AWS_BUCKET_NAME!,
        Key: paths.thumbnail,
        Body: thumbnailStream,
        ContentType: "image/jpeg",
      })
    );

    // Upload video
    await s3Client.send(
      new PutObjectCommand({
        Bucket: ENV.AWS_BUCKET_NAME!,
        Key: paths.video,
        Body: videoStream,
        ContentType: "video/mp4",
      })
    );

    // Cleanup temp files
    await fs.promises.unlink(thumbnail.path);
    await fs.promises.unlink(video.path);
  } catch (err) {
    console.error("S3 upload failed:", err);
    throw new Error("S3 file upload failed");
  }
};
