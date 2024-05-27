import mongoose, { Document, Schema } from "mongoose";

export interface PostDocument extends Document {
  user: string; // Change from mongoose.Types.ObjectId to string
  content: string;
  imageUrls: string[];
  comments: mongoose.Types.ObjectId[];
  likes: mongoose.Types.ObjectId[];
  timestamp: Date;
}

const PostSchema = new Schema<PostDocument>({
  user: { type: String, ref: "User", required: true }, // Change from Schema.Types.ObjectId to String
  content: { type: String, required: true },
  imageUrls: { type: [String], required: false },
  comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
  likes: [{ type: Schema.Types.ObjectId, ref: "Like" }],
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.model<PostDocument>("Post", PostSchema);
