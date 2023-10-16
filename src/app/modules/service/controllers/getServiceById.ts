import { Request, Response } from "express";
import catchAsync from "../../../../shared/HOF/catchAsync";
import sendResponse from "../../../../shared/utilities/sendResponse";
import httpStatus from "http-status";
import { Service } from "../service.model";
import { IService } from "../service.interface";

const getServiceById = catchAsync(async (req: Request, res: Response) => {
  const serviceId = req.params.id;
  const data = await Service.findById(serviceId);
    sendResponse<IService | null>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Service information retrieved successfully",
      data,
    });
  });

  export default getServiceById;