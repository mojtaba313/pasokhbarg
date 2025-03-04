// models/PageAccess.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IPageAccess extends Document {
  _id:string;
  pageRoute: string; // مسیر صفحه (مثلاً /tests یا /admin)
  isPublic: boolean; // آیا صفحه عمومی است؟
  allowedUsers: string[]; 
  // allowedUsers: mongoose.Types.ObjectId[]; 
  allowedRoles: string[]; // لیست نقش‌های مجاز (مثلاً admin, user)
}

const PageAccessSchema = new Schema<IPageAccess>({
  pageRoute: { type: String, required: true, unique: true },
  isPublic: { type: Boolean, default: false },
  allowedUsers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  allowedRoles: [{ type: String }],
});

export default mongoose.models.PageAccess || mongoose.model<IPageAccess>('PageAccess', PageAccessSchema);