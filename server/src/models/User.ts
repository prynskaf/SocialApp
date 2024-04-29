import mongoose, { Document, Schema } from "mongoose";

export interface UserDocument extends Document {
  firstName: string;
  lastName: string;
  userImage: string;
}

const UserSchema = new Schema<UserDocument>({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  userImage: { type: String, required: false }, // Optional for now
});

export default mongoose.model<UserDocument>("User", UserSchema);
