import { Request, Response, RequestHandler } from "express";
import ffmpeg from "fluent-ffmpeg";
import { validationResult } from "express-validator";
import { StatusCodes } from "http-status-codes";
import { PrismaClient } from "@prisma/client";
import { prismaErrorHandler } from "../../utility/prismaErrorHandler.js";
import "dotenv/config";
import fs from "fs";
import path from "path";
import { writeFile } from "fs/promises";
import sharp from "sharp";

// Extend the Request interface to include the 'files' property
// Removed incorrect import as 'File' is not exported by 'multer'

declare module "express-serve-static-core" {
  interface Request {
    files?: { [fieldname: string]: Express.Multer.File[] };
  }
}

const prisma = new PrismaClient();
const ENV = process.env;
const NODE_ENV = ENV.NODE_ENV;
const basePath = `${process.cwd()}/uploads`;

// under development
export class UserController {
  static readonly getFeedData: RequestHandler = async (req: Request, res: Response) => {
    try {
      const feedData = await prisma.video.findMany({
        where: {
          ageRestricted: false,
          isPrivate: false,
          deletedAt: null, // Only non-deleted videos
          user: {
            isBlock: false,
            isAdmin: false,
            suspendTill: null,
            deletedAt: null,
          },
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
        videoPath: `${basePath}/${video.user.username}/video/${video.videoPath}`,
        thumbnailPath: `${basePath}/${video.user.username}/thumbnail/${video.thumbnailPath}`,
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

  static readonly getVideo: RequestHandler = async (req: Request, res: Response) => {
    const videoUUID = req.params.uuid;

    if (!videoUUID) {
      res.status(StatusCodes.BAD_REQUEST).json(apiResponse(ResponseCategory.ERROR, "invalidVideoId"));
      return;
    }
    try {
      const video = await prisma.video.findUnique({
        where: { uuid: videoUUID.toString(), isPrivate: false, deletedAt: null },
      });

      if (!video) {
        res.status(StatusCodes.BAD_REQUEST).json(apiResponse(ResponseCategory.ERROR, "videoNotFound"));
        return;
      }

      res.status(StatusCodes.OK).json(apiResponse(ResponseCategory.SUCCESS, "dataFetched", video));
    } catch (error) {
      throw new Error(prismaErrorHandler(error as IPrismaError));
    }
  };

  /**
   * @description Get user by id
   *
   * @static
   * @param {Request} req
   * @param {Response} res
   * @type {RequestHandler}
   * @memberof UserController
   */
  static readonly getUser: RequestHandler = async (req: Request, res: Response) => {
    const userId = parseInt(req.params.id);
    if (isNaN(userId)) {
      res.status(StatusCodes.BAD_REQUEST).json(apiResponse(ResponseCategory.ERROR, "invalidUserId"));
      return;
    }
    try {
      const user = await prisma.user.findUnique({
        omit: { password: true },
        where: { id: userId, isAdmin: false },
      });

      if (!user) {
        res.status(StatusCodes.BAD_REQUEST).json(apiResponse(ResponseCategory.ERROR, "userNotFound"));
        return;
      }

      res.status(StatusCodes.OK).json(apiResponse(ResponseCategory.SUCCESS, "dataFetched", safeJson(user)));
    } catch (error) {
      throw new Error(prismaErrorHandler(error as IPrismaError));
    }
  };

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

      const { userId, categoryId, ageRestricted, isPrivate, title, description, keywords } = req.body;

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

      // Process thumbnail
      const thumbnailOutputPath = `uploads/${user.username}/thumbnail/${thumbnailFileName}`;
      await sharp(thumbnailFile.path)
        .resize(1280, 720, {
          fit: "cover",
          position: "centre",
        })
        .jpeg({ quality: 80 })
        .toFile(thumbnailOutputPath);

      // Check thumbnail size not exceeding 2MB
      const thumbnailStats = await fs.promises.stat(thumbnailOutputPath);
      if (thumbnailStats.size > 2 * 1024 * 1024) {
        // 2MB
        res.status(StatusCodes.BAD_REQUEST).json(apiResponse(ResponseCategory.ERROR, "thumbnailTooLarge"));
        return;
      }

      // Move video file to final destination
      const videoOutputPath = `uploads/${user.username}/video/${videoFileName}`;
      await fs.promises.rename(videoFile.path, videoOutputPath);

      // Check video size not exceeding 500MB
      if (videoFile.size > 500 * 1024 * 1024) {
        res.status(StatusCodes.BAD_REQUEST).json(apiResponse(ResponseCategory.ERROR, "videoTooLarge"));
        return;
      }

      // Get video duration
      const duration = await new Promise<number>((resolve, reject) => {
        ffmpeg.ffprobe(videoOutputPath, (err, metadata) => {
          if (err) reject(err);
          resolve(metadata.format.duration || 0);
        });
      });

      // Create video record
      await prisma.video.create({
        data: {
          userId: Number(userId),
          categoryId: Number(categoryId),
          ageRestricted,
          isPrivate,
          title,
          description,
          keywords,
          size: videoFile.size.toString(),
          duration: duration.toString(),
          videoPath: videoOutputPath,
          thumbnailPath: thumbnailOutputPath,
          viewCount: "0",
          uuid: generateUUID(),
        },
      });

      res.status(StatusCodes.OK).json(apiResponse(ResponseCategory.SUCCESS, "videoUploaded"));
    } catch (error) {
      throw new Error(prismaErrorHandler(error as IPrismaError));
    }
  };
}
