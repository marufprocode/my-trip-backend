import { Schema, model } from 'mongoose';
import { AdminModel, AdminStaticModel, IAdmin } from './admin.interface';
import bcrypt from 'bcrypt';
import config from '../../../config';

const adminSchema = new Schema<IAdmin, Record<string, unknown>, AdminStaticModel>(
  {
    phoneNumber: { type: String, required: true, unique: true },
    role: { type: String, enum: ['admin'], required: true },
    password: { type: String, required: true, select: 0 },
    name: {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
    },
    address: { type: String, required: true },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

adminSchema.statics.isAdminExist = async function (
  phoneNumber: string
): Promise<Pick<IAdmin, 'id' | 'password' | 'role'> | null> {
  return await Admin.findOne({ phoneNumber }, { id: 1, password: 1, role: 1 });
};

adminSchema.statics.isPasswordMatched = async function (
  givenPassword: string,
  savedPassword: string
): Promise<boolean> {
  return await bcrypt.compare(givenPassword, savedPassword);
};

adminSchema.pre('save', async function (next) {
  // hashing user password
  this.password = await bcrypt.hash(this.password, Number(config.bycrypt_salt_rounds));
  next();
});

adminSchema.pre('findOneAndUpdate', async function(next) {
  const update = this.getUpdate() as Partial<IAdmin>
  if(update.password){
    update.password = await bcrypt.hash(update.password, Number(config.bycrypt_salt_rounds));
  }
  next();
});

export const Admin = model<IAdmin, AdminModel>('Admin', adminSchema);
