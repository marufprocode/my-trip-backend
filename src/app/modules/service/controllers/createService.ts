import { Request, Response } from "express";
import catchAsync from "../../../../shared/HOF/catchAsync";
import httpStatus from "http-status";
import { Service } from "../service.model";
import { IService } from "../service.interface";
import sendResponse from "../../../../shared/utilities/sendResponse";

const createService = catchAsync(async (req: Request, res: Response) => {
    const data = await Service.create(req.body);
    sendResponse<IService>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Service created successfully",
      data,
    });
  });

  export default createService;