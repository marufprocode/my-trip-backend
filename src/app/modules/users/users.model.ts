import { Schema, model } from 'mongoose';
import { IUser, UserModel } from './users.interface';
import bcrypt from 'bcrypt';
import config from '../../../config';
import { ENUM_USER_ROLE } from '../../../shared/enums/usersEnum';

const userSchema = new Schema<IUser, Record<string, unknown>, UserModel>(
  {
    name: {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
    },
    phone_number: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, enum: Object.values(ENUM_USER_ROLE), required: true, default: ENUM_USER_ROLE.USER},
    password: { type: String, required: true, select: 0 },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

userSchema.statics.isUserExist = async function (
  email: string
): Promise<Pick<IUser, 'id' | 'password' | 'role' | 'email'> | null> {
  return await User.findOne({ email }, { id: 1, password: 1, role: 1, email:1 });
};

userSchema.statics.isPasswordMatched = async function (
  givenPassword: string,
  savedPassword: string
): Promise<boolean> {
  return await bcrypt.compare(givenPassword, savedPassword);
};

userSchema.pre('save', async function (next) {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const user = this;
  if (user.isNew) {
  user.password = await bcrypt.hash(user.password, Number(config.bycrypt_salt_rounds));
  }
  next();
});

userSchema.pre('findOneAndUpdate', async function (next) {
  const update = this.getUpdate() as Partial<IUser>;
  if (update.password) {
    update.password = await bcrypt.hash(update.password, Number(config.bycrypt_salt_rounds));
  }
  next();
});

export const User = model<IUser, UserModel>('User', userSchema);
