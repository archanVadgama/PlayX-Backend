import { PrismaClient } from "@prisma/client";
import "dotenv/config";
import { Request, RequestHandler, Response } from "express";
import { validationResult } from "express-validator";
import ffmpeg from "fluent-ffmpeg";
import fs from "fs";
import { StatusCodes } from "http-status-codes";
import path from "path";
import sharp from "sharp";
import { prismaErrorHandler } from "../../utility/prismaErrorHandler.js";

// Extend the Request interface to include the 'files' property
declare module "express-serve-static-core" {
  interface Request {
    files?: { [fieldname: string]: Express.Multer.File[] };
  }
}

const CUSTOM_BASE_PATH = `${process.env.APP_URL}:${process.env.PORT}/stream`;
const prisma = new PrismaClient();

/**
 *  Crop the thumbnail to a specific size and format it to JPEG
 *
 * @param {string} thumbnailPath
 * @param {string} outputPath
 * @return {*}  {Promise<void>}
 */
async function cropThumbnail(thumbnailPath: string, outputPath: string): Promise<void> {
  try {
    await sharp(thumbnailPath)
      .resize(1280, 720, { fit: "cover", position: "centre" }) // Resize to 1280x720
      .jpeg({ quality: 80 })
      .toFile(outputPath);
  } catch (error) {
    console.error("Error cropping thumbnail:", error);
    throw error;
  }
}

/**
 * Store video and thumbnail in the server
 *
 * @param {Response} res
 * @param {string} username
 * @param {Record<string, string>} paths
 * @param {Express.Multer.File} video
 * @param {Express.Multer.File} thumbnail
 * @return {*}
 */
async function storeFilesInServe(
  res: Response,
  username: string,
  paths: Record<string, string>,
  video: Express.Multer.File,
  thumbnail: Express.Multer.File
) {
  // Ensure directories exist
  await Promise.all([
    fs.promises.mkdir(`uploads/${username}/thumbnail`, { recursive: true }),
    fs.promises.mkdir(`uploads/${username}/video`, { recursive: true }),
  ]);

  // Move files to their respective directories
  await cropThumbnail(thumbnail.path, paths.thumbnail);

  // Delete the old image
  await fs.promises.unlink(thumbnail.path);

  // Check if the thumbnail is too large
  if ((await fs.promises.stat(paths.thumbnail)).size > 10 * 1024 * 1024) {
    res.status(StatusCodes.BAD_REQUEST).json(apiResponse(ResponseCategory.ERROR, "thumbnailTooLarge"));
    return;
  }

  // Move the video file to its final destination
  await fs.promises.rename(video.path, paths.video);
}

export class VideoController {
  /**
   * Get data for the home page feed
   *
   * @static
   * @param {Request} req
   * @param {Response} res
   * @type {RequestHandler}
   * @memberof VideoController
   */
  static readonly getFeedData: RequestHandler = async (req: Request, res: Response) => {
    try {
      const feedData = await prisma.video.findMany({
        where: {
          // isAgeRestricted: false,
          isPrivate: false,
          deletedAt: null, // Only non-deleted videos
          user: {
            isBlock: false,
            isAdmin: false,
            suspendTill: null,
            deletedAt: null,
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        select: {
          userId: true,
          uuid: true,
          title: true,
          duration: true,
          viewCount: true,
          createdAt: true,
          videoPath: true,
          thumbnailPath: true,
          user: {
            select: {
              username: true,
              displayName: true,
              channelName: true,
              image: true,
            },
          },
        },
      });

      const feedDataWithCustomPaths = feedData.map((video) => ({
        ...video,
        duration: Number(video.duration),
        viewCount: Number(video.viewCount),
        videoPath: `${CUSTOM_BASE_PATH}/${video.videoPath}`,
        thumbnailPath: `${CUSTOM_BASE_PATH}/${video.thumbnailPath}`,
      }));

      if (!feedData) {
        res.status(StatusCodes.BAD_REQUEST).json(apiResponse(ResponseCategory.ERROR, "dataNotFound"));
        return;
      }

      res
        .status(StatusCodes.OK)
        .json(apiResponse(ResponseCategory.SUCCESS, "dataFetched", feedDataWithCustomPaths));
    } catch (error) {
      throw new Error(prismaErrorHandler(error as IPrismaError));
    }
  };

  /**
   * Get video data by UUID
   *
   * @static
   * @param {Request} req
   * @param {Response} res
   * @type {RequestHandler}
   * @memberof VideoController
   */
  static readonly getVideo: RequestHandler = async (req: Request, res: Response) => {
    const videoUUID = req.params.uuid;

    if (!videoUUID) {
      res.status(StatusCodes.BAD_REQUEST).json(apiResponse(ResponseCategory.ERROR, "invalidVideoId"));
      return;
    }
    try {
      const videoData = await prisma.video.findUnique({
        where: { uuid: videoUUID.toString(), isPrivate: false, deletedAt: null },
        select: {
          uuid: true,
          title: true,
          duration: true,
          viewCount: true,
          createdAt: true,
          videoPath: true,
          thumbnailPath: true,
          user: {
            select: {
              username: true,
              displayName: true,
              channelName: true,
              image: true,
            },
          },
        },
      });

      if (!videoData) {
        res.status(StatusCodes.BAD_REQUEST).json(apiResponse(ResponseCategory.ERROR, "videoNotFound"));
        return;
      }

      const feedDataWithCustomPaths = {
        ...videoData,
        duration: Number(videoData.duration),
        viewCount: Number(videoData.viewCount),
        videoPath: `${CUSTOM_BASE_PATH}/${videoData.videoPath}`,
        thumbnailPath: `${CUSTOM_BASE_PATH}/${videoData.thumbnailPath}`,
      };
      res
        .status(StatusCodes.OK)
        .json(apiResponse(ResponseCategory.SUCCESS, "dataFetched", feedDataWithCustomPaths));
    } catch (error) {
      throw new Error(prismaErrorHandler(error as IPrismaError));
    }
  };

  /**
   * Upload a video along with its thumbnail
   *
   * @static
   * @param {Request} req
   * @param {Response} res
   * @type {RequestHandler}
   * @memberof VideoController
   */
  static readonly uploadVideo: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    try {
      // Validation check
      const result = validationResult(req);
      if (!result.isEmpty()) {
        res
          .status(StatusCodes.BAD_REQUEST)
          .json(
            apiResponse(
              ResponseCategory.ERROR,
              "validationFailed",
              result.formatWith((msg) => msg.msg).mapped()
            )
          );
        return;
      }

      // File existence check
      const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
      const videoFile = files?.["video"]?.[0];
      const thumbnailFile = files?.["thumbnail"]?.[0];

      if (!videoFile) {
        res.status(StatusCodes.BAD_REQUEST).json(apiResponse(ResponseCategory.ERROR, "videoIsRequired"));
        return;
      }

      if (!thumbnailFile) {
        res.status(StatusCodes.BAD_REQUEST).json(apiResponse(ResponseCategory.ERROR, "thumbnailIsRequired"));
        return;
      }

      const { userId, categoryId, isAgeRestricted, isPrivate, title, description, keywords } = req.body;

      // User existence check
      const user = await prisma.user.findUnique({
        select: { username: true },
        where: { id: Number(userId) },
      });

      if (!user) {
        res.status(StatusCodes.BAD_REQUEST).json(apiResponse(ResponseCategory.ERROR, "userNotFound"));
        return;
      }

      const timestamp = Date.now();
      const videoFileName = `${timestamp}.mp4`;
      const thumbnailFileName = `${timestamp}.jpeg`;

      const paths = {
        thumbnailDB: `${user.username}/thumbnail/${thumbnailFileName}`,
        thumbnail: `uploads/${user.username}/thumbnail/${thumbnailFileName}`,
        videoDB: `${user.username}/video/${videoFileName}`,
        video: `uploads/${user.username}/video/${videoFileName}`,
      };

      // Store files in the server
      await storeFilesInServe(res, user.username, paths, videoFile, thumbnailFile);

      if (videoFile.size > 500 * 1024 * 1024) {
        res.status(StatusCodes.BAD_REQUEST).json(apiResponse(ResponseCategory.ERROR, "videoTooLarge"));
        return;
      }

      const duration = await new Promise<number>((resolve, reject) =>
        ffmpeg.ffprobe(paths.video, (err, metadata) =>
          err ? reject(err) : resolve(metadata.format.duration || 0)
        )
      );

      await prisma.video.create({
        data: {
          userId: Number(userId),
          categoryId: Number(categoryId),
          isAgeRestricted,
          isPrivate,
          title,
          description,
          keywords,
          size: videoFile.size,
          duration: duration.toFixed(4), // Round to 3 decimal places
          videoPath: paths.videoDB,
          thumbnailPath: paths.thumbnailDB,
          uuid: generateUUID(),
        },
      });

      res.status(StatusCodes.OK).json(apiResponse(ResponseCategory.SUCCESS, "videoUploaded"));
    } catch (error) {
      throw new Error(prismaErrorHandler(error as IPrismaError));
    }
  };

  /**
   * It will use to stream the video file to the client.
   *
   * @static
   * @param {Request} req
   * @param {Response} res
   * @type {RequestHandler}
   * @memberof VideoController
   */
  static readonly videoStream: RequestHandler = (req: Request, res: Response): void => {
    const { username, filename } = req.params;

    if (!username || !filename) {
      res.status(400).json(apiResponse(ResponseCategory.ERROR, "requiredParamsNotFound"));
    }

    const videoPath = path.join(process.cwd(), "uploads", username, "video", filename);

    if (!fs.existsSync(videoPath)) {
      res.status(400).json(apiResponse(ResponseCategory.ERROR, "videoNotFound"));
    }

    const stat = fs.statSync(videoPath);
    const fileSize = stat.size;
    const range = req.headers.range;

    if (range) {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunkSize = end - start + 1;

      const file = fs.createReadStream(videoPath, { start, end });
      const head = {
        "Content-Range": `bytes ${start}-${end}/${fileSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": chunkSize,
        "Content-Type": "video/mp4",
        "Cross-Origin-Resource-Policy": "cross-origin",
      };

      res.writeHead(206, head);
      file.pipe(res);
    } else {
      const head = {
        "Content-Length": fileSize,
        "Content-Type": "video/mp4",
        "Cross-Origin-Resource-Policy": "cross-origin",
      };

      res.writeHead(200, head);
      fs.createReadStream(videoPath).pipe(res);
    }
  };

  /**
   * Get the thumbnail of the video.
   *
   * @static
   * @param {Request} req
   * @param {Response} res
   * @type {RequestHandler}
   * @memberof VideoController
   */
  static readonly getThumbnail: RequestHandler = (req: Request, res: Response): void => {
    const { username, filename } = req.params;

    if (!username || !filename) {
      res.status(400).json(apiResponse(ResponseCategory.ERROR, "requiredParamsNotFound"));
    }

    // Thumbnail path instead of video
    const thumbnailPath = path.join(process.cwd(), "uploads", username, "thumbnail", filename);

    if (!fs.existsSync(thumbnailPath)) {
      res.status(400).json(apiResponse(ResponseCategory.ERROR, "thumbnailNotFound"));
    }

    const stat = fs.statSync(thumbnailPath);
    const fileSize = stat.size;

    const head = {
      "Content-Length": fileSize,
      "Content-Type": "image/jpeg",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET",
      "Access-Control-Allow-Headers": "Content-Type",
      "Cross-Origin-Resource-Policy": "cross-origin",
    };

    res.writeHead(200, head);
    fs.createReadStream(thumbnailPath).pipe(res);
  };
}
