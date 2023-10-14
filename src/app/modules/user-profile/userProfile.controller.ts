import httpStatus from "http-status";
import ApiError from "../../../errors/errors.apiError";
import catchAsync from "../../../shared/HOF/catchAsync";
import sendResponse from "../../../shared/utilities/sendResponse";
import { IUserProfile } from "./userProfile.interace";
import userProfileService from "./userProfile.service";
import { Request, Response } from "express";

const getMyProfile = catchAsync(async (req: Request, res: Response) => {
    if (!req.user) {
      return new ApiError(httpStatus.FORBIDDEN, 'forbidden access');
    }
    const data = await userProfileService.getMyProfileFromDB(req.user?.userId);
    sendResponse<IUserProfile | null>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "User's information retrieved successfully",
      data,
    });
  });
const getAllProfile = catchAsync(async (req: Request, res: Response) => {
    const data = await userProfileService.getAllProfileFromDB();
    sendResponse<IUserProfile[]>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "User's information retrieved successfully",
      data,
    });
  });
const getProfileById = catchAsync(async (req: Request, res: Response) => {
    const data = await userProfileService.getProfileByIdFromDB(req.params.id);
    sendResponse<IUserProfile | null>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "User's information retrieved successfully",
      data,
    });
  });
  const updateMyProfile = catchAsync(async (req: Request, res: Response) => {
    if (!req.user) {
      return new ApiError(httpStatus.FORBIDDEN, 'forbidden access');
    }
    const result = await userProfileService.updateMyProfileToDB(req.user.userId, req.body);
    sendResponse<IUserProfile | null>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: `${result ? "User's information updated successfully":"No User's information found"}`,
      data:result,
    });
  });
  const updateProfileById = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id;
    const result = await userProfileService.updateProfileByIdToDB(id, req.body);
    sendResponse<IUserProfile | null>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: `${result ? "User's information updated successfully":"No User's information found"}`,
      data:result,
    });
  });

  export default { getMyProfile, updateMyProfile, updateProfileById, getProfileById, getAllProfile };