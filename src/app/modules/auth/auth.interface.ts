import { IUser } from "../users/users.interface";

export interface ILoginUserResponse {
  accessToken: string;
  refreshToken?: string;
  user: IUser | null;
}

export interface ILoginUser {
  email: string;
  password: string;
};

export interface IRefreshTokenResponse {
  accessToken: string;
};