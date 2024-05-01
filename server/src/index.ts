import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import router from "./routes/index";
import multer from "multer";
import path from "path";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cors());

// Connect to MongoDB using URL from environment variables
mongoose
  .connect(process.env.MONGO_DB_URL!)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Multer configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "uploads")); // Save files in the 'uploads' folder within the 'src' directory
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname); // Define how files should be named
  },
});

const upload = multer({ storage: storage });

// Routes
app.use("/api", router);

// Route for file uploads
app.post("/api/upload", upload.single("file"), (req, res) => {
  // Access the uploaded file via req.file
  console.log(req.file);
  res.send("File uploaded successfully");
});

// Serve uploaded files statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
