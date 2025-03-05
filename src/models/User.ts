import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  _id: string;
  name: string;
  username: string;
  password: string;
  roles: string[];
  permissions: string[];
  supervisors: mongoose.Types.ObjectId[]; // ادمین‌های مسئول این کاربر
  assistantOf?: mongoose.Types.ObjectId; // برای دستیارها
  assistantPermissions: string[]; // دسترسی‌های اختصاصی دستیار
  students: mongoose.Types.ObjectId[]; // دانش‌آموزان زیرمجموعه
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    roles: { type: [String], default: ['user'] },
    permissions: { type: [String], default: [] },
    supervisors: [{ 
      type: Schema.Types.ObjectId, 
      ref: 'User',
      validate: {
        validator: function(v: mongoose.Types.ObjectId[]) {
          return this.roles.includes('user') && v.every(id => id instanceof mongoose.Types.ObjectId);
        },
        message: 'فقط کاربران عادی می‌توانند سوپروایزر داشته باشند'
      }
    }],
    assistantOf: { 
      type: Schema.Types.ObjectId,
      ref: 'User',
      validate: {
        validator: function(v: mongoose.Types.ObjectId) {
          return this.roles.includes('assistant') && v instanceof mongoose.Types.ObjectId;
        },
        message: 'فقط دستیارها می‌توانند مسئول داشته باشند'
      }
    },
    assistantPermissions: { 
      type: [String],
      validate: {
        validator: function(v: string[]) {
          return this.roles.includes('assistant');
        },
        message: 'فقط دستیارها می‌توانند دسترسی اختصاصی داشته باشند'
      }
    },
    students: [{ 
      type: Schema.Types.ObjectId, 
      ref: 'User',
      validate: {
        validator: function(v: mongoose.Types.ObjectId[]) {
          return this.roles.includes('admin') && v.every(id => id instanceof mongoose.Types.ObjectId);
        },
        message: 'فقط ادمین‌ها می‌توانند دانش‌آموز داشته باشند'
      }
    }]
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);