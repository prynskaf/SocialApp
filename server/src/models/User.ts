import mongoose, { Document, Schema } from "mongoose";

export interface UserDocument extends Document {
  _id: string; // Add id field to store the provided _id value
  firstName: string;
  lastName: string;
  emailAddress: string;
  userImage?: string;
}

const UserSchema = new Schema<UserDocument>({
  _id: { type: String, required: true }, // Define id field
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  emailAddress: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  userImage: { type: [String], required: false },
});

export default mongoose.model<UserDocument>("User", UserSchema);
