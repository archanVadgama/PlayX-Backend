import { Request, Response, RequestHandler } from "express";
import { apiResponse } from "../utility/helper.js";
import { StatusCodes } from "http-status-codes";

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
  static readonly dashboard: RequestHandler = (req: Request, res: Response) => {
    res
      .status(StatusCodes.OK)
      .json(apiResponse(ResponseCategory.SUCCESS, "dataFetched"));
  };
}
