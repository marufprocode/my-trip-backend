/* eslint-disable no-unused-vars */
import { Model } from "mongoose";

export enum SERVICE_TYPE {
    HOTEL =  "hotel",
    FLIGHT = 'flight',
    CAB = 'cab',
    BUS = 'bus',
    TRAIN = 'train',
    HOLIDAY = 'holiday'
}

export interface IService {
    service: SERVICE_TYPE;
    name: string;
    from: string;
    to: string;
    startDate: Date;
    price: number;
    capacity: number;
    location: string;
    time: Date;
    description: string;
    country: string;
    image: string | null;
  }
  

  export type IServiceModel = Model<IService>;