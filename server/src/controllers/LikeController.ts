import { Request, Response } from "express";
import Like from "../models/Like";
import Post from "../models/Post";

// Get all likes
export const getAllLikes = async (req: Request, res: Response) => {
  try {
    const likes = await Like.find();
    res.status(200).json(likes);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single like by ID
export const getLikeById = async (req: Request, res: Response) => {
  const likeId = req.params.id;
  try {
    const like = await Like.findById(likeId);
    if (!like) {
      return res.status(404).json({ message: "Like not found" });
    }
    res.status(200).json(like);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new like
export const createLike = async (req: Request, res: Response) => {
  const { user_id, post_id } = req.body;
  try {
    const newLike = await Like.create({ user: user_id, post: post_id });

    // Update the corresponding post's likes array
    const updatedPost = await Post.findByIdAndUpdate(
      post_id,
      { $push: { likes: newLike._id } }, // Push the ID of the new like into the likes array
      { new: true }
    );

    if (!updatedPost) {
      // If the post is not found, handle the error
      return res.status(404).json({ message: "Post not found" });
    }

    // Return the new like and updated post
    res.status(201).json({ like: newLike, post: updatedPost });
  } catch (error: any) {
    // Handle any errors that occur during the process
    res.status(400).json({ message: error.message });
  }
};

// Delete a like by ID
export const deleteLike = async (req: Request, res: Response) => {
  const likeId = req.params.id;
  try {
    const deletedLike = await Like.findByIdAndDelete(likeId);
    if (!deletedLike) {
      return res.status(404).json({ message: "Like not found" });
    }
    res.status(200).json(deletedLike);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
