import { Request, Response } from "express";
import User, { UserDocument } from "../models/User";

// Function to find a user by Clerk ID
const findUserByClerkId = async (
  clerkId: string
): Promise<UserDocument | null> => {
  try {
    const user = await User.findOne({ clerkId });
    return user;
  } catch (error) {
    console.error("Error finding user:", error);
    throw new Error("Error finding user");
  }
};

// Function to register a new user
const registerUser = async (userData: any): Promise<UserDocument> => {
  try {
    const newUser = await User.create(userData);
    return newUser;
  } catch (error) {
    console.error("Error creating user:", error);
    throw new Error("Error creating user");
  }
};

// Get all users
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single user by ID
export const getUserById = async (req: Request, res: Response) => {
  const userId = req.params.id;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Function to validate email address format
const isValidEmail = (email: string) => {
  // Regular expression for basic email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Create a new user
export const createUser = async (req: Request, res: Response) => {
  console.log("Received data:", req.body);

  // Log the full request object
  console.log("Full Request Object:", req);

  const { firstName, lastName, userImage, emailAddress } = req.body;
  try {
    // Check if firstName, lastName, and emailAddress are provided
    if (!firstName || !lastName || !emailAddress) {
      throw new Error("First name, last name, and email address are required");
    }

    // Validate the format of the email address
    if (!isValidEmail(emailAddress)) {
      throw new Error("Invalid email address format");
    }

    // Check if the user already exists by email address
    const existingUser = await User.findOne({ emailAddress });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User with this email already exists" });
    }

    // Create a new user with provided details
    const newUser = await User.create({
      firstName,
      lastName,
      userImage,
      emailAddress,
    });
    res.status(201).json(newUser);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// Update a user by ID
export const updateUser = async (req: Request, res: Response) => {
  const userId = req.params.id;
  const { firstName, lastName, userImage } = req.body;
  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { firstName, lastName, userImage },
      { new: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(updatedUser);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a user by ID
export const deleteUser = async (req: Request, res: Response) => {
  const userId = req.params.id;
  try {
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(deletedUser);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export default { getAllUsers, getUserById, createUser, updateUser, deleteUser };
