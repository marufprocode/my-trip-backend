import { CookieOptions, Request, Response } from 'express';
import catchAsync from '../../../shared/HOF/catchAsync';
import sendResponse from '../../../shared/utilities/sendResponse';
import { IUser } from '../users/users.interface';
import httpStatus from 'http-status';
import authService from './auth.service';
import { ILoginUserResponse, IRefreshTokenResponse } from './auth.interface';

const signUp = catchAsync(async (req: Request, res: Response) => {
  const user = req.body;
  const result = await authService.signUpUserToDB(user);
  sendResponse<IUser>(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Users created successfully',
    data: result,
  });
});

const loginUser = catchAsync(async (req: Request, res: Response) => {
  const loginData = req.body;
  const result = await authService.loginUser(loginData);
  const { refreshToken, ...others } = result;

  const cookieOptions: CookieOptions = {
    secure: true,
    sameSite: 'none',
    httpOnly: true,
  };

  res.cookie('refreshToken', refreshToken, cookieOptions);

  sendResponse<ILoginUserResponse>(res, {
    statusCode: 200,
    success: true,
    message: 'User logged in successfully !',
    data: others,
  });
});
const adminSignIn = catchAsync(async (req: Request, res: Response) => {
  const loginData = req.body;
  const result = await authService.adminSignIn(loginData);
  const { refreshToken, ...others } = result;

  const cookieOptions: CookieOptions = {
    secure: true,
    sameSite: 'none',
    httpOnly: true,
  };

  res.cookie('refreshToken', refreshToken, cookieOptions);

  sendResponse<ILoginUserResponse>(res, {
    statusCode: 200,
    success: true,
    message: 'User logged in successfully !',
    data: others,
  });
});

const refreshToken = catchAsync(async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies;

  const result = await authService.refreshToken(refreshToken);

  // set refresh token into cookie

  const cookieOptions: CookieOptions = {
    secure: true,
    httpOnly: true,
    sameSite:"none",
  };

  res.cookie('refreshToken', refreshToken, cookieOptions);

  sendResponse<IRefreshTokenResponse>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'New access token generated successfully !',
    data: result,
  });
});



export default { signUp, loginUser, refreshToken, adminSignIn };
