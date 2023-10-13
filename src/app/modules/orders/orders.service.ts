import mongoose from 'mongoose';
import ApiError from '../../../errors/errors.apiError';
import { IOrder } from './orders.interface';
import { Order } from './orders.model';
import { User } from '../users/users.model';
import { Cow } from '../cow/cow.model';
import httpStatus from 'http-status';

const createOrderToDB = async (data: IOrder): Promise<IOrder | null> => {
  const buyer = await User.findById(data.buyer);
  const cow = await Cow.findById(data.cow);
  let newOrderResult: IOrder | null = null;

  if (cow === null || buyer === null) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to retrieve buyer or cow');
  } else if (cow.price > buyer.budget) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Buyer does not have enough money to buy this cow');
  } else if (cow.label === 'sold out') {
    throw new ApiError(httpStatus.BAD_REQUEST, 'This cow has been sold out');
  }
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const seller = await User.findById(cow.seller);
    if (seller === null) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Seller is not valid');
    }
    const cowPrice = cow.price;
    const buyerBudget = buyer.budget - cowPrice;
    const sellerIncome = seller.income + cowPrice;

    const updatedCow = await Cow.findByIdAndUpdate(
      cow.id,
      { label: 'sold out' },
      { new: true, session }
    );
    const updatedSeller = await User.findByIdAndUpdate(
      cow.seller,
      { income: sellerIncome },
      { new: true, session }
    );
    const updatedBuyer = await User.findByIdAndUpdate(
      buyer.id,
      { budget: buyerBudget },
      { new: true, session }
    );

    if (!updatedCow || !updatedSeller || !updatedBuyer) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to proceed order');
    }

    const result = await Order.create([data], { new: true, session });
    if (!result || result.length === 0) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to proceed order');
    }
    newOrderResult = result[0];

    await session.commitTransaction();
    await session.endSession();
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw error;
  }

  return newOrderResult;
};

const getAllOrdersFromDB = async (user: Record<string, unknown>): Promise<IOrder[] | null> => {
  if (user.role === 'admin') {
    const orders = await Order.find({}).populate([{ path: 'cow' }, { path: 'buyer' }]);
    return orders;
  } else if (user.role === 'buyer') {
    const orders = await Order.find({ buyer: user.userId }).populate([
      { path: 'cow' },
      { path: 'buyer' },
    ]);
    return orders;
  } else if (user.role === 'seller') {
    const filteredOrders = await Order.aggregate([
      {
        $lookup: {
          from: 'cows',
          localField: 'cow',
          foreignField: '_id',
          as: 'cow',
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'buyer',
          foreignField: '_id',
          as: 'buyer',
        },
      },
      {
        $match: {
          'cow.seller': new mongoose.Types.ObjectId(user.userId as string),
        },
      },
    ]);
    return filteredOrders;
  } else {
    return null;
  }
};

const getSingleOrderFromDB = async (
  id: string,
  user: Record<string, unknown>
): Promise<IOrder | null> => {
  if (user.role === 'admin') {
    const result = await Order.findById(id).populate([{ path: 'cow' }, { path: 'buyer' }]);
    return result;
  } else if (user.role === 'buyer') {
    const orders = await Order.findOne({ buyer: user.userId }).populate([
      { path: 'cow' },
      { path: 'buyer' },
    ]);
    return orders;
  } else if (user.role === 'seller') {
    const orders = await Order.findOne({ buyer: user.userId }).populate([
      { path: 'cow', match: { seller: user.userId } },
      { path: 'buyer' },
    ]);
    return orders;
  } else {
    return null;
  }
};

export default { createOrderToDB, getAllOrdersFromDB, getSingleOrderFromDB };
