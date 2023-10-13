import { Model, Schema } from 'mongoose';

export interface IOrder extends Document {
  cow: Schema.Types.ObjectId;
  buyer: Schema.Types.ObjectId;
}

export type OrderModel = Model<IOrder, Record<string, unknown>>;
