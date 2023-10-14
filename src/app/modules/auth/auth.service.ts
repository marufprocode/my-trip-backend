import httpStatus from 'http-status';
import ApiError from '../../../errors/errors.apiError';
import { IUser } from '../users/users.interface';
import { User } from '../users/users.model';
import { ILoginUser, ILoginUserResponse, IRefreshTokenResponse } from './auth.interface';
import { jwtHelpers } from '../../../shared/helpers/jwtHelpers';
import config from '../../../config';
import mongoose from 'mongoose';
import { UserProfile } from '../user-profile/userProfile.model';

const signUpUserToDB = async (userData: IUser): Promise<IUser | null> => {
  if(userData.role && userData.role !== 'user'){
   throw new ApiError(httpStatus.NOT_ACCEPTABLE, 'role is not valid');
  }
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

const loginUser = async (payload: ILoginUser): Promise<ILoginUserResponse> => {
  const { email, password } = payload;

  const isUserExist = await User.isUserExist(email);

  
  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist');
  }

  if (isUserExist.role !== 'user') {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Plese use admin portal for login');
  }
  
  const user = await User.findById(isUserExist._id).lean();

  if (isUserExist.password && !(await User.isPasswordMatched(password, isUserExist.password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Password is incorrect');
  }

  //create access token & refresh token
  const { _id: userId, role } = isUserExist;
  const accessToken = jwtHelpers.createToken(
    { userId, role },
    config.jwt.secret,
    config.jwt.expires_in
  );

  const refreshToken = jwtHelpers.createToken(
    { userId, role },
    config.jwt.refresh_secret,
    config.jwt.refresh_expires_in
  );

  return {
    accessToken,
    refreshToken,
    user,
  };
};
const adminSignIn = async (payload: ILoginUser): Promise<ILoginUserResponse> => {
  const { email, password } = payload;

  const isUserExist = await User.isUserExist(email);

  
  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist');
  }
  if (isUserExist.role === 'user') {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Plese use user portal for login');
  }
  
  const user = await User.findById(isUserExist._id).lean();

  if (isUserExist.password && !(await User.isPasswordMatched(password, isUserExist.password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Password is incorrect');
  }

  //create access token & refresh token
  const { _id: userId, role } = isUserExist;
  const accessToken = jwtHelpers.createToken(
    { userId, role },
    config.jwt.secret,
    config.jwt.expires_in
  );

  const refreshToken = jwtHelpers.createToken(
    { userId, role },
    config.jwt.refresh_secret,
    config.jwt.refresh_expires_in
  );

  return {
    accessToken,
    refreshToken,
    user,
  };
};

const refreshToken = async (token: string): Promise<IRefreshTokenResponse> => {
  let verifiedToken = null;
  try {
    verifiedToken = jwtHelpers.verifyToken(
      token,
      config.jwt.refresh_secret
    );
  } catch (err) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Invalid Refresh Token');
  }

  const { userId } = verifiedToken;

  // checking deleted user's refresh token
  const isUserExist = await User.findById(userId, {id:1, role:1});;

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist');
  }
  //generate new token
  const newAccessToken = jwtHelpers.createToken(
    {
      id: isUserExist.id,
      role: isUserExist.role,
    },
    config.jwt.secret,
    config.jwt.expires_in
  );

  return {
    accessToken: newAccessToken,
  };
};


export default { signUpUserToDB, loginUser, refreshToken, adminSignIn };
