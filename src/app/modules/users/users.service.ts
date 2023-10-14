import { IUser } from './users.interface';
import { User } from './users.model';
import mongoose from 'mongoose';
import { UserProfile } from '../user-profile/userProfile.model';

const getAllUsersFromDB = async (): Promise<IUser[] | null> => {
  const users = await User.find({});
  return users;
};
const createUserToDb = async (userData:IUser): Promise<IUser | null> => {

  const session = await mongoose.startSession();
  session.startTransaction();
  try{
    const createdUser = await User.create([userData], { session, select: '-password' });
    const userProfile = {
      user: createdUser[0]._id,
    };
    await UserProfile.create([userProfile], { session });
    const user = User.findById(createdUser[0]._id)
    await session.commitTransaction();
    session.endSession();
    return user;
  }catch (error){
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};
const getSingleUserFromDB = async (id: string): Promise<IUser | null> => {
  const user = await User.findById(id);
  return user;
};
const deleteUserFromDB = async (id: string): Promise<IUser | null> => {

  const session = await mongoose.startSession();
  session.startTransaction();
  try{
    const removedUser = await User.findByIdAndRemove([id]);
    await UserProfile.findOneAndRemove([{user:id}]);
    await session.commitTransaction();
    session.endSession();
    return removedUser;
  }catch (error){
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};
const updateUserToDB = async (id: string, data: Partial<IUser>): Promise<IUser | null> => {
  const result = await User.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  return result;
};


export default {
  getAllUsersFromDB,
  getSingleUserFromDB,
  deleteUserFromDB,
  updateUserToDB,
  createUserToDb,
};
