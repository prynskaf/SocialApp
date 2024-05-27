import mongoose, { Document, Schema } from "mongoose";

export interface CommentDocument extends Document {
  user: string; // Change from mongoose.Types.ObjectId to string
  post: mongoose.Types.ObjectId;
  content: string;
  timestamp: Date;
}

const CommentSchema = new Schema<CommentDocument>({
  user: { type: String, ref: "User", required: true }, // Change from Schema.Types.ObjectId to String
  post: { type: Schema.Types.ObjectId, ref: "Post", required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.model<CommentDocument>("Comment", CommentSchema);
