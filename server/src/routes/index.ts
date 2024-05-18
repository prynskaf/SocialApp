import express from "express";
import {
  getAllUsers,
  createUser,
  getUserById,
  updateUser,
  deleteUser,
} from "../controllers/UsersController";
import {
  getAllPosts,
  createPost,
  getPostById,
  updatePost,
  deletePost,
} from "../controllers/PostController";
import {
  getAllComments,
  createComment,
  getCommentById,
  updateComment,
  deleteComment,
} from "../controllers/CommentController";
import {
  getAllLikes,
  createLike,
  getLikeById,
  deleteLike,
} from "../controllers/LikeController";
import { upload } from "../utils/multerConfig";

const router = express.Router();

// User routes
router.get("/users", getAllUsers);
router.get("/users/:id", getUserById);
router.post("/users", createUser);
router.put("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);

// Post routes
router.get("/posts", getAllPosts);
router.get("/posts/:id", getPostById);
router.post("/posts", upload.single("image"), createPost); // Use multer middleware here for file upload
router.put("/posts/:id", updatePost);
router.delete("/posts/:id", deletePost);

// Comment routes
router.get("/comments", getAllComments);
router.get("/comments/:id", getCommentById);
router.post("/comments", createComment);
router.put("/comments/:id", updateComment);
router.delete("/comments/:id", deleteComment);

// Like routes
router.get("/likes", getAllLikes);
router.get("/likes/:id", getLikeById);
router.post("/likes", createLike);
router.delete("/likes/:id", deleteLike);

export default router;
