import path from "path";
import { s3 } from "../index";

export const uploadImageToS3 = async (imageFile: Express.Multer.File) => {
  console.log("Image buffer:", imageFile.buffer); // Log image buffer
  const timestamp = Date.now();

  const randomString = Math.random().toString(36).substring(7);
  const fileExtension = path.extname(imageFile.originalname);
  const key = `${timestamp}_${randomString}${fileExtension}`;

  const uploadParams = {
    Bucket: process.env.AWS_BUCKET_NAME!,
    Key: key,
    Body: imageFile.buffer, // Set the Body parameter to the image buffer
    ACL: "public-read",
  };

  try {
    const data = await s3.upload(uploadParams).promise();
    return data.Location;
  } catch (error) {
    console.error("Error uploading file to S3:", error);
    throw new Error("Failed to upload file to S3");
  }
};
