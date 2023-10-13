import { Schema, model } from 'mongoose';
import { IOrder, OrderModel } from './orders.interface';
import { Cow } from '../cow/cow.model';
import ApiError from '../../../errors/errors.apiError';
import httpStatus from 'http-status';
import { User } from '../users/users.model';

const orderSchema = new Schema<IOrder>(
  {
    cow: { type: Schema.Types.ObjectId, ref: 'Cow', required: true },
    buyer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

orderSchema.pre('save', async function (next) {
  const isCowExist = await Cow.exists({
    _id: this.cow,
  });
  if (!isCowExist) {
    // Document with the same title and year already exists
    return next(new ApiError(httpStatus.BAD_REQUEST, `Cow Id is not Valid`));
  }
  const isBuyerExist = await User.exists({
    _id: this.buyer,
    role: 'buyer',
  });
  if (!isBuyerExist) {
    // Document with the same title and year already exists
    return next(new ApiError(httpStatus.BAD_REQUEST, `Buyer Id is not Valid`));
  }
  // Document does not exist, proceed with the save operation
  next();
});


export const Order = model<IOrder, OrderModel>('Order', orderSchema);