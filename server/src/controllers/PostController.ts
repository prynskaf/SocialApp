import { Request, Response } from "express";
import User from "../models/User";
import Post from "../models/Post";
import { uploadImageToS3 } from "../utils/uploadImageToS3";

// Get all posts with user details
export const getAllPosts = async (req: Request, res: Response) => {
  try {
    const posts = await Post.find()
      .populate("user", "firstName lastName imageUrls") // Include user imageUrls
      .exec();
    res.status(200).json(posts);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single post by ID with user details
export const getPostById = async (req: Request, res: Response) => {
  const postId = req.params.id;
  try {
    const post = await Post.findById(postId)
      .populate("user", "firstName lastName imageUrls") // Include user imageUrls
      .exec();
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.status(200).json(post);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new post
export const createPost = async (req: Request, res: Response) => {
  console.log("Request object:", req);
  const { email, content } = req.body;
  const imageFile = req.file;

  try {
    console.log("Received image file:", imageFile);

    if (!email || !content) {
      return res
        .status(400)
        .json({ message: "Email and content are required" });
    }

    const user = await User.findOne({ emailAddress: email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    let imageUrl = null;
    if (imageFile) {
      if (!imageFile.mimetype.startsWith("image")) {
        return res
          .status(400)
          .json({ message: "Only image files are allowed" });
      }

      imageUrl = await uploadImageToS3(imageFile);
    }

    const newPost = await Post.create({
      user: user._id,
      content,
      imageUrl,
    });

    res.status(201).json(newPost);
  } catch (error: any) {
    console.error("Error creating post:", error);
    res
      .status(500)
      .json({ message: "Failed to create post", error: error.message });
  }
};

// Update a post by ID
export const updatePost = async (req: Request, res: Response) => {
  const postId = req.params.id;
  const { content, imageUrls } = req.body;
  try {
    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { content, imageUrls },
      { new: true }
    )
      .populate("user", "firstName lastName imageUrls") // Include user imageUrls
      .exec();
    if (!updatedPost) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.status(200).json(updatedPost);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a post by ID
export const deletePost = async (req: Request, res: Response) => {
  const postId = req.params.id;
  try {
    const deletedPost = await Post.findByIdAndDelete(postId);
    if (!deletedPost) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.status(200).json(deletedPost);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
