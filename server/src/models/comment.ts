import mongoose, { Document, Schema } from "mongoose";

export interface CommentDocument extends Document {
  user: mongoose.Types.ObjectId;
  post: mongoose.Types.ObjectId;
  content: string;
  timestamp: Date;
}

const CommentSchema = new Schema<CommentDocument>({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  post: { type: Schema.Types.ObjectId, ref: "Post", required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.model<CommentDocument>("Comment", CommentSchema);
