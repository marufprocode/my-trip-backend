import { Schema, model } from 'mongoose';
import { IUserProfile, UserProfileModel } from './userProfile.interace';

const userProfileSchema = new Schema<IUserProfile, Record<string, unknown>, UserProfileModel>(
  {
    dateOfBirth: { type: Date },
    image: { type: String },
    gender: { type: String, enum: ['male', 'female'] },
    nationality: { type: String },
    passport: {
      number: { type: String },
      expirationDate: { type: Date },
    },
    address: {
      state: { type: String },
      street: { type: String },
      zip: { type: String },
      coordinates: { lat: { type: Number }, lng: { type: Number } },
    },
    age: { type: Number },
    user:{type: Schema.Types.ObjectId, ref:"User", required:true}
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);


export const UserProfile = model<IUserProfile, UserProfileModel>('UserProfile', userProfileSchema);
