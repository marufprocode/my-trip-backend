import { Request, Response } from "express";
import catchAsync from "../../../shared/HOF/catchAsync";
import sendResponse from "../../../shared/utilities/sendResponse";
import ordersService from "./orders.service";
import httpStatus from "http-status";
import { IOrder } from "./orders.interface";
import ApiError from "../../../errors/errors.apiError";

const createOrder = catchAsync(async (req: Request, res: Response) => {
    const data = req.body;
    const result = await ordersService.createOrderToDB(data);
    sendResponse<IOrder | null>(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: `${result? 'Order created successfully':'Some error occurred! no order was created!'}`,
      data: result,
    });
  });

  const getAllOrders = catchAsync(async (req: Request, res: Response) => {
    if (!req.user) {
      return new ApiError(httpStatus.FORBIDDEN, 'forbidden access, seller is not authorized');
    }
    const result = await ordersService.getAllOrdersFromDB(req.user);
    sendResponse<IOrder[]>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Orders retrieved successfully',
      data:result,
    });
  });

  const getSingleOrder = catchAsync(async (req: Request, res: Response) => {
    if (!req.user) {
      return new ApiError(httpStatus.FORBIDDEN, 'forbidden access, seller is not authorized');
    }
    const id = req.params.id;
    const result = await ordersService.getSingleOrderFromDB(id, req.user);
    sendResponse<IOrder | null>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: `${result ? 'Cow retrieved successfully !' : `No Cow found with id: ${id}`}`,
      data: result,
    });
  });
  

export default {createOrder, getAllOrders, getSingleOrder}