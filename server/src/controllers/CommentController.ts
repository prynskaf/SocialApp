import { Request, Response } from "express";
import Comment from "../models/comment";
import Post from "../models/Post";
import User from "../models/User";

// Get all comments
export const getAllComments = async (req: Request, res: Response) => {
  try {
    const comments = await Comment.find().populate(
      "user",
      "firstName lastName"
    );
    res.status(200).json(comments);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single comment by ID
export const getCommentById = async (req: Request, res: Response) => {
  const commentId = req.params.id;
  try {
    const comment = await Comment.findById(commentId).populate(
      "user",
      "firstName lastName"
    );
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }
    res.status(200).json(comment);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new comment
export const createComment = async (req: Request, res: Response) => {
  const { email, post_id, content } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ emailAddress: email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Create the comment
    const newComment = await Comment.create({
      user: user._id,
      post: post_id,
      content,
    });

    // Update the corresponding post's comments array
    const updatedPost = await Post.findByIdAndUpdate(
      post_id,
      { $push: { comments: newComment._id } }, // Push the ID of the new comment into the comments array
      { new: true }
    );

    if (!updatedPost) {
      // If the post is not found, handle the error
      return res.status(404).json({ message: "Post not found" });
    }

    // Return the new comment and updated post
    res.status(201).json({ comment: newComment, post: updatedPost });
  } catch (error: any) {
    // Handle any errors that occur during the process
    res.status(400).json({ message: error.message });
  }
};
// Update a comment by ID
export const updateComment = async (req: Request, res: Response) => {
  const commentId = req.params.id;
  const { content } = req.body;
  try {
    const updatedComment = await Comment.findByIdAndUpdate(
      commentId,
      { content },
      { new: true }
    );
    if (!updatedComment) {
      return res.status(404).json({ message: "Comment not found" });
    }
    res.status(200).json(updatedComment);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a comment by ID
export const deleteComment = async (req: Request, res: Response) => {
  const commentId = req.params.id;
  try {
    const deletedComment = await Comment.findByIdAndDelete(commentId);
    if (!deletedComment) {
      return res.status(404).json({ message: "Comment not found" });
    }
    res.status(200).json(deletedComment);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
