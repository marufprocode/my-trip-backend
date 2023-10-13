import { Request, Response } from 'express';
import catchAsync from '../../../shared/HOF/catchAsync';
import sendResponse from '../../../shared/utilities/sendResponse';
import { IAdmin } from './admin.interface';
import httpStatus from 'http-status';
import adminService from './admin.service';
import config from '../../../config';
import { ILoginUserResponse } from '../auth/auth.interface';

const createAdmin = catchAsync(async (req: Request, res: Response) => {
  const data = req.body;
  const result = await adminService.createAdminToDB(data);
  sendResponse<Partial<IAdmin>>(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Admin created successfully',
    data: result,
  });
});

const loginAdmin = catchAsync(async (req: Request, res: Response) => {
  const loginData = req.body;
  const result = await adminService.loginAdmin(loginData);
  const { refreshToken, ...others } = result;

  // set refresh token into cookie
  const cookieOptions = {
    secure: config.env === 'production',
    httpOnly: true,
  };

  res.cookie('refreshToken', refreshToken, cookieOptions);

  sendResponse<ILoginUserResponse>(res, {
    statusCode: 200,
    success: true,
    message: 'Admin logged in successfully!',
    data: others,
  });
});


export default {
  createAdmin, loginAdmin
};
