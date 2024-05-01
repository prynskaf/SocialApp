import multer from "multer";
import path from "path";

// Set up storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../uploads")); // Adjust the path as necessary
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Use the original file extension
  },
});

export const upload = multer({ storage: storage });
