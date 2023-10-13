/* eslint-disable no-unused-vars */
import { Document, Model } from 'mongoose';

interface AdminName {
  firstName: string;
  lastName: string;
}

export interface IAdmin extends Document {
  phoneNumber: string;
  role: 'admin';
  password: string;
  name: AdminName;
  address: string;
}

export interface AdminStaticModel extends Model<IAdmin> {
  isPasswordMatched(givenPassword: string, savedPassword: string): Promise<boolean>;
  isAdminExist(phoneNumber: string): Promise<Pick<IAdmin, 'id' | 'password' | 'role'>>;
}

export type AdminModel = AdminStaticModel;
