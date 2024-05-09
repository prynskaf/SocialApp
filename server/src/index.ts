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

// Logging middleware to log every request
app.use((req, res, next) => {
  console.log("Incoming request:", req.method, req.path);
  next();
});

// Connect to MongoDB using URL from environment variables
mongoose
  .connect(process.env.MONGO_DB_URL!)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes
app.use("/api", router);

// Serve uploaded images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Set CORS headers
app.use((req, res, next) => {
  res.setHeader(
    "Access-Control-Allow-Origin",
    "https://social-app-phi-eight.vercel.app/"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
