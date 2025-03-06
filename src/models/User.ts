// models/User.ts
import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcrypt";

export interface IUser extends Document {
  _id: string;
  name: string;
  username: string;
  password: string;
  roles: string[]; // نقش‌های کاربر (مثلاً user, admin, assistant)
  permissions: string[]; // دسترسی‌های کاربر
  managedUsers?: mongoose.Types.ObjectId[]; // کاربران زیرمجموعه
  managedBy?: mongoose.Types.ObjectId[]; // لیست ادمین‌هایی که این کاربر را مدیریت می‌کنند
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    roles: { type: [String], default: ["user"] }, // نقش‌های کاربر (مثلاً user, admin, assistant)
    permissions: { type: [String], default: [] }, // دسترسی‌های کاربر
    managedUsers: [{ type: Schema.Types.ObjectId, ref: "User" }], // کاربران زیرمجموعه
    managedBy: [{ type: Schema.Types.ObjectId, ref: "User" }], // لیست ادمین‌هایی که این کاربر را مدیریت می‌کنند
  },
  { timestamps: true }
);

UserSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare passwords
UserSchema.methods.comparePassword = async function (candidatePassword: string) {
  return await bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.models.User ||
  mongoose.model<IUser>("User", UserSchema);
