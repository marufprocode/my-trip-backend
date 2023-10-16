import { Request, Response } from "express";
import catchAsync from "../../../../shared/HOF/catchAsync";
import sendResponse from "../../../../shared/utilities/sendResponse";
import httpStatus from "http-status";
import { Service } from "../service.model";
import { IService } from "../service.interface";

const createService = catchAsync(async (req: Request, res: Response) => {
    const data = await Service.create(req.body);
    sendResponse<IService>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "User's information retrieved successfully",
      data,
    });
  });

  export default createService;