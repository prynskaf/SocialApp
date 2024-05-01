// postController.ts (Backend)

import { Request, Response } from "express";
import User from "../models/User";
import Post from "../models/Post";
import path from "path";

// Get all posts
export const getAllPosts = async (req: Request, res: Response) => {
  try {
    const posts = await Post.find();
    res.status(200).json(posts);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single post by ID
export const getPostById = async (req: Request, res: Response) => {
  const postId = req.params.id;
  try {
    const post = await Post.findById(postId);
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
  const { email, content } = req.body;
  const imageFile = req.file; // This will have the file information

  try {
    // Check if the user exists based on the email address
    const user = await User.findOne({ emailAddress: email });

    // If the user doesn't exist, return an error
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    let imagePath = null;
    // Check if an image was uploaded
    if (imageFile) {
      // Handle file type validation (e.g., allow only images)
      if (!imageFile.mimetype.startsWith("image")) {
        return res
          .status(400)
          .json({ message: "Only image files are allowed" });
      }
      // Handle file size validation if needed
      // if (imageFile.size > MAX_FILE_SIZE) {
      //   return res.status(400).json({ message: "File size exceeds the limit" });
      // }

      // Save the image path or process as needed
      imagePath = imageFile.path;

      // Extract the filename from the full path
      const filename = path.basename(imagePath);
      // Store only the filename in the imageUrls array
      imagePath = filename;
    }

    // Assume there's logic to handle creation of post with imagePath
    const newPost = await Post.create({
      user: user._id, // Associate the user with the post
      content,
      imageUrls: [imagePath], // Store only the filename
    });
    res.status(201).json(newPost);
  } catch (error: any) {
    // Log the error for debugging purposes
    console.error("Error creating post:", error);
    res.status(500).json({ message: "Failed to create post" });
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
    );
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
