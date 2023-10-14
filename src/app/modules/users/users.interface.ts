/* eslint-disable no-unused-vars */
import { Document, Model } from 'mongoose';
import { ENUM_USER_ROLE } from '../../../shared/enums/usersEnum';

interface UserName {
  firstName: string;
  lastName: string;
}

export interface IUser extends Document{
  name: UserName;
  phone_number: string;
  email: string;
  role: ENUM_USER_ROLE;
  password: string;
}

export interface UserStaticModel extends Model<IUser> {
  isPasswordMatched(givenPassword: string, savedPassword: string): Promise<boolean>;
  isUserExist(email: string): Promise<Pick<IUser, '_id' | 'password' | 'role' | 'email'>>;
}


export type UserModel = UserStaticModel;
