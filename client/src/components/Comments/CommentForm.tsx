import React, { useState, FormEvent } from "react";
import { TextField, Button, Box, Typography } from "@mui/material";

interface CommentFormProps {
  userId: string;
  postId: string;
}

const CommentForm: React.FC<CommentFormProps> = ({ userId, postId }) => {
  const [comment, setComment] = useState("");

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!comment.trim()) {
      console.error("Comment is required.");
      return;
    }

    try {
      const response = await fetch("/api/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: userId,
          post_id: postId,
          content: comment,
        }),
      });

      if (response.ok) {
        console.log("Comment submitted successfully");
        setComment(""); // Reset the comment field on successful submission
      } else {
        console.error("Failed to submit comment:", response.statusText);
        const errorData = await response.json();
        console.error("Error Details:", errorData.message);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <Box
      component="div"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        mt: 2,
        p: 2,
        border: "1px solid #ccc",
        borderRadius: "8px",
        backgroundColor: "#f9f9f9",
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      <Typography variant="h6" gutterBottom>
        Add a Comment
      </Typography>
      <form
        onSubmit={handleSubmit}
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        <TextField
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Write your comment..."
          multiline
          rows={4}
          variant="outlined"
          fullWidth
          required
        />
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Submit
        </Button>
      </form>
    </Box>
  );
};

export default CommentForm;
