import httpStatus from "http-status";
import ApiError from "../../../errors/errors.apiError";
import { ILoginUser, ILoginUserResponse } from "../auth/auth.interface";
import { IAdmin } from "./admin.interface";
import { Admin } from "./admin.model";
import { jwtHelpers } from "../../../shared/helpers/jwtHelpers";
import config from "../../../config";

const createAdminToDB = async (data: IAdmin): Promise<IAdmin | null> => {
    const createdAdmin = await Admin.create(data);
    if (!createdAdmin) {
      throw new ApiError(400, 'Failed to create admin');
    }
    const admin = await Admin.findById(createdAdmin.id)
    return admin;
  };

  const loginAdmin = async (payload: ILoginUser): Promise<ILoginUserResponse> => {
    const { phoneNumber, password } = payload;
  
    const isUserExist = await Admin.isAdminExist(phoneNumber);
  
    if (!isUserExist) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Admin does not exist');
    }
  
    if (
      isUserExist.password &&
      !(await Admin.isPasswordMatched(password, isUserExist.password))
    ) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Password is incorrect');
    }
  
    //create access token & refresh token
  
    const { id: userId, role } = isUserExist;
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
    };
  };
    
  


export default {
    createAdminToDB, loginAdmin
}