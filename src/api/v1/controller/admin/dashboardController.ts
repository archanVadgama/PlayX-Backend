import { Request, Response, RequestHandler } from "express";
import { apiResponse } from "../../utility/helper.js";
import { StatusCodes } from "http-status-codes";
import { PrismaClient } from "@prisma/client";
import { prismaErrorHandler } from "../../utility/prismaErrorHandler.js";

/**
 * DashboardController class handles dashboard related operations
 *
 * @export
 * @class DashboardController
 */
export class DashboardController {
  /**
   * Handles dashboard data fetching
   *
   * @static
   * @param {Request} req
   * @param {Response} res
   * @type {RequestHandler}
   * @memberof DashboardController
   */
  static readonly dashboard: RequestHandler = async (req: Request, res: Response) => {
    try {
      const prisma = new PrismaClient();
      const [
        category,
        likes,
        report,
        comment,
        user,
        blockedUsers,
        deletedUsers,
        creator,
        totalVideos,
        videoStats,
      ] = await Promise.all([
        prisma.category.count(),
        prisma.likes.count(),
        prisma.report.count(),
        prisma.comment.count(),
        prisma.user.count({ where: { isAdmin: false } }),
        prisma.user.count({
          where: {
            isBlock: true,
            isAdmin: false,
          },
        }),
        prisma.user.count({
          where: {
            deletedAt: { not: null },
            isAdmin: false,
          },
        }),
        prisma.user.count({
          where: {
            channelName: {
              not: null,
            },
            isAdmin: false,
          },
        }),
        prisma.video.count(),
        prisma.video.aggregate({
          _sum: {
            viewCount: true,
          },
        }),
      ]);

      const dashboardData = {
        category,
        likes,
        report,
        comment,
        user,
        blockedUsers,
        deletedUsers,
        creator,
        totalVideos,
        totalVideoViews: Number(videoStats._sum.viewCount),
      };

      res
        .status(StatusCodes.OK)
        .json(apiResponse(ResponseCategory.SUCCESS, "dataFetched", safeJson(dashboardData)));
    } catch (error) {
      throw new Error(prismaErrorHandler(error as IPrismaError));
    }
  };
}
