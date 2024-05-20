import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import router from "./routes/index";
// import path from "path";
import { Request, Response, NextFunction } from "express";

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

// Testing
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Routes
app.use("/api", router);

// Serve uploaded images
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Set CORS headers
app.use((req, res, next) => {
  res.setHeader(
    "Access-Control-Allow-Origin",
    "https://social-9fxtfs33m-prince-kaf.vercel.app"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use((req, res, next) => {
  console.log(req.body); // Log the body to see what's being parsed
  console.log(req.file); // or req.files for multiple files
  next();
});

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
