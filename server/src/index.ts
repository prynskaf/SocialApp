import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import router from "./routes/index";
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

// Routes
app.use("/api", router);

// Serve uploaded images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
