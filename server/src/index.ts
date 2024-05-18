import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import router from "./routes/index";
import AWS from "aws-sdk";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies and enable CORS
app.use(express.json());
app.use(cors());

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

// Middleware to log every request
app.use((req, res, next) => {
  console.log("Incoming request:", req.method, req.path);
  next();
});

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_DB_URL!)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Mount your API routes
app.use("/api", router);

// Configure AWS SDK
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const s3 = new AWS.S3();

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

export { s3 };
