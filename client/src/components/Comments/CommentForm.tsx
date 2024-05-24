import React, { useState, FormEvent } from "react";
import { TextField, Button, Box, useTheme, useMediaQuery } from "@mui/material";
import { User } from "../../types";
import { toast } from "sonner";

interface CommentFormProps {
  user: User;
  postId: string;
  fetchPosts: () => void;
  userEmail: string;
}

const CommentForm: React.FC<CommentFormProps> = ({
  // user,
  postId,
  fetchPosts,
  userEmail, // Receive userEmail prop
}) => {
  const [comment, setComment] = useState("");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Inside your component
  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!comment.trim()) {
      console.error("Comment is required.");
      return;
    }

    const loadingToastId = toast.loading("Posting comment...");

    try {
      const response = await fetch("/api/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: userEmail, // Use email address
          post_id: postId,
          content: comment,
        }),
      });

      if (response.ok) {
        console.log("Comment submitted successfully");
        setComment("");
        fetchPosts();
        toast.dismiss(loadingToastId);
        toast.success("Comment was successfully posted");
      } else {
        console.error("Failed to submit comment:", response.statusText);
        const errorData = await response.json();
        console.error("Error Details:", errorData.message);
        toast.dismiss(loadingToastId);
        toast.error(errorData.message);
      }
    } catch (error) {
      console.error("Error:", error);
      toast.dismiss(loadingToastId);
      toast.error("An error occurred while posting the comment.");
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
        borderRadius: "8px",
        backgroundColor: "#f9f9f9",
        width: "100%",
        boxSizing: "border-box",
      }}
    >
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
          rows={2}
          variant="outlined"
          fullWidth
          required
        />
        {comment.trim() && (
          <Button
            type="submit"
            variant="contained"
            sx={{
              width: isMobile ? "100%" : "100px",
              borderRadius: "10px",
              bgcolor: "#7a20a1",
              "&:hover": {
                bgcolor: "#7a20a2", // Specify the color you want on hover
              },
            }}
          >
            Submit
          </Button>
        )}
      </form>
    </Box>
  );
};

export default CommentForm;
