import mongoose, { Document, Schema } from "mongoose";

export interface LikeDocument extends Document {
  user: string; // Change from mongoose.Types.ObjectId to string
  post: mongoose.Types.ObjectId;
  timestamp: Date;
}

const LikeSchema = new Schema<LikeDocument>({
  user: { type: String, ref: "User", required: true }, // Change from Schema.Types.ObjectId to String
  post: { type: Schema.Types.ObjectId, ref: "Post", required: true },
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.model<LikeDocument>("Like", LikeSchema);
