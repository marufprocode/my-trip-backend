import { Request, Response } from "express";
import catchAsync from "../../../../shared/HOF/catchAsync";
import sendResponse from "../../../../shared/utilities/sendResponse";
import httpStatus from "http-status";
import { Service } from "../service.model";
import { IService } from "../service.interface";

const getAllService = catchAsync(async (req: Request, res: Response) => {
    const data = await Service.find({});
    sendResponse<IService[]>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "All services retrieved successfully",
      data,
    });
  });

  export default getAllService;