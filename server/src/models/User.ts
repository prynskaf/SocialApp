import mongoose, { Document, Schema } from "mongoose";

export interface UserDocument extends Document {
  firstName: string;
  lastName: string;
  emailAddress: string; // Add emailAddress field
  userImage?: string; // Make userImage optional
}

const UserSchema = new Schema<UserDocument>({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  emailAddress: { type: String, required: true, unique: true }, // Add unique constraint
  userImage: { type: String, required: false }, // Optional for now
});

export default mongoose.model<UserDocument>("User", UserSchema);
