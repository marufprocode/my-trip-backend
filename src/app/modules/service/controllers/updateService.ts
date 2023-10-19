import { Request, Response } from "express";
import catchAsync from "../../../../shared/HOF/catchAsync";
import sendResponse from "../../../../shared/utilities/sendResponse";
import httpStatus from "http-status";
import { Service } from "../service.model";
import { IService } from "../service.interface";

const updateService = catchAsync(async (req: Request, res: Response) => {
    const requestedData = req.body;
    const serviceId = req.params.id;
    const result = await Service.findByIdAndUpdate(serviceId, requestedData, {new:true})
    sendResponse<IService>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Service updated successfully",
      data: result,
    });
  });

  export default updateService;