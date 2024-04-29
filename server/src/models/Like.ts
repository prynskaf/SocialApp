import mongoose, { Document, Schema } from "mongoose";

export interface LikeDocument extends Document {
  user: mongoose.Types.ObjectId;
  post: mongoose.Types.ObjectId;
  timestamp: Date;
}

const LikeSchema = new Schema<LikeDocument>({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  post: { type: Schema.Types.ObjectId, ref: "Post", required: true },
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.model<LikeDocument>("Like", LikeSchema);
