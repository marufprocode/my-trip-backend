/* eslint-disable no-unused-vars */
import mongoose from 'mongoose';
import { Document, Model } from 'mongoose';

export interface IUserProfile extends Document {
  dateOfBirth?: Date;
  image?: string;
  gender?: 'male' | 'female';
  nationality?: string;
  passport?: {
    number: string;
    expirationDate: Date;
  };
  address?: {
    state?: string;
    street?: string;
    zip?: string;
    coordinates?: { lat: number; lng: number };
  };
  age?: number;
  user: mongoose.Types.ObjectId;
}

export type UserProfileModel = Model<IUserProfile>;
