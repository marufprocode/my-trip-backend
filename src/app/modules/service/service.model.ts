import { Schema, model } from 'mongoose';
import { SERVICE_TYPE, IService, IServiceModel } from './service.interface';

const serviceSchema = new Schema<IService, Record<string, unknown>, IServiceModel>(
  {
    service: { type: String, enum: Object.values(SERVICE_TYPE), required: true },
    name: { type: String, required: true },
    from: { type: String, required: true },
    to: { type: String, required: true },
    startDate: { type: Date, required: true },
    price: { type: Number, required: true },
    capacity: { type: Number, required: true },
    location: { type: String, required: true },
    time: { type: Date, required: true },
    description: { type: String, required: true },
    country: { type: String, required: true },
    image: { type: String, default: null },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);


export const Service = model<IService, IServiceModel>('Service', serviceSchema);
