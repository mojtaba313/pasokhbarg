// models/User.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  _id:string;
  name: string;
  username: string;
  password: string;
  roles: string[]; // اضافه کردن فیلد roles
  permissions: string[]; // اضافه کردن فیلد permissions
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    roles: { type: [String], default: ['user'] }, // مقدار پیش‌فرض 'user'
    permissions: { type: [String], default: [] }, // مقدار پیش‌فرض خالی
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);