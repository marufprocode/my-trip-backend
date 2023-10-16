import { Request, Response } from "express";
import catchAsync from "../../../../shared/HOF/catchAsync";
import sendResponse from "../../../../shared/utilities/sendResponse";
import httpStatus from "http-status";
import { Service } from "../service.model";
import { IService } from "../service.interface";

const deleteService = catchAsync(async (req: Request, res: Response) => {
    const serviceId = req.params.id;
    const result = await Service.findByIdAndRemove(serviceId);
    sendResponse<IService | null>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Service deleted successfully",
      data:result,
    });
  });

  export default deleteService;