import nodemailer from "nodemailer";
import dotenv from "dotenv";

// Load configuration from env file
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail", // or another email service
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendWelcomeEmail = async (email: string, name: string) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Welcome to SocialConnect!",
    text: `Hello ${name},\n\nThank you for registering at SocialConnect!\n\nBest regards,\nSocialConnect Team`,
  };
  try {
    await transporter.sendMail(mailOptions);
    console.log("Welcome email sent successfully");
  } catch (error) {
    console.error("Error sending welcome email:", error);
  }
};
