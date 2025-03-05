import mongoose, { Schema, Document } from 'mongoose';

export interface IPageAccess extends Document {
  _id: string;
  pageRoute: string;
  isPublic: boolean;
  allowedUsers: string[];
  allowedRoles: string[];
}

const PageAccessSchema = new Schema<IPageAccess>({
  pageRoute: { type: String, required: true, unique: true },
  isPublic: { type: Boolean, default: false },
  allowedUsers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  allowedRoles: [{ type: String }],
});

export default mongoose.models.PageAccess || mongoose.model<IPageAccess>('PageAccess', PageAccessSchema);