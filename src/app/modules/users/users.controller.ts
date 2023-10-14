import { Request, Response } from 'express';
import usersService from './users.service';
import catchAsync from '../../../shared/HOF/catchAsync';
import httpStatus from 'http-status';
import sendResponse from '../../../shared/utilities/sendResponse';
import { IUser } from './users.interface';

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const data = await usersService.getAllUsersFromDB();
  sendResponse<IUser[] | null>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Users retrieved successfully',
    data,
  });
});
const createUser = catchAsync(async (req: Request, res: Response) => {
  const data = await usersService.createUserToDb(req.body);
  sendResponse<IUser>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Users created successfully',
    data,
  });
});

const getSignleUsers = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const data = await usersService.getSingleUserFromDB(id);
  sendResponse<IUser | null>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: `${data ? 'User retrieved successfully' : `No user found with id: ${id}`}`,
    data,
  });
});

const deleteUser = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const data = await usersService.deleteUserFromDB(id);
  sendResponse<IUser | null>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: `${data ? 'User deleted successfully' : `No user found with id: ${id}`}`,
    data,
  });
});
const updateUser = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await usersService.updateUserToDB(id, req.body);
  sendResponse<IUser>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: `${result ? 'User updated successfully' : `Something went wrong, Not updated!`}`,
    data:result,
  });
});


export default { getAllUsers, getSignleUsers, deleteUser, updateUser, createUser };
