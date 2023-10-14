import httpStatus from 'http-status';
import ApiError from '../../../errors/errors.apiError';
import { IUserProfile } from './userProfile.interace';
import { UserProfile } from './userProfile.model';

const getMyProfileFromDB = async (userId: string): Promise<IUserProfile> => {
  const userProfile = await UserProfile.findOne({ user: userId });
  if (!userProfile) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User Profile Not Found');
  }
  return userProfile;
};
const getAllProfileFromDB = async (): Promise<IUserProfile[]> => {
  const userProfiles = await UserProfile.find({}).populate('user');
  if (!userProfiles) {
    throw new ApiError(httpStatus.NOT_FOUND, 'No Users Profile Not Found');
  }
  return userProfiles;
};
const getProfileByIdFromDB = async (profileId: string): Promise<IUserProfile> => {
  const userProfile = await UserProfile.findById(profileId);
  if (!userProfile) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User Profile Not Found');
  }
  return userProfile;
};
const updateMyProfileToDB = async (
  userId: string,
  data: Partial<IUserProfile>
): Promise<IUserProfile | null> => {
  const result = await UserProfile.findOneAndUpdate({ user: userId }, data, {
    new: true,
    runValidators: true,
  }).lean();
  console.log({ result });
  return result;
};
const updateProfileByIdToDB = async (
  profileId: string,
  data: Partial<IUserProfile>
): Promise<IUserProfile | null> => {
  const result = await UserProfile.findByIdAndUpdate(profileId, data, {
    new: true,
    runValidators: true,
  }).lean();
  console.log({ result });
  return result;
};

export default {
  getMyProfileFromDB,
  updateMyProfileToDB,
  updateProfileByIdToDB,
  getProfileByIdFromDB,
  getAllProfileFromDB,
};