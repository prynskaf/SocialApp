import React, { useState, FormEvent } from "react";
import { TextField, Button, Box, useTheme, useMediaQuery } from "@mui/material";
import Snackbar from "@mui/material/Snackbar";

interface CommentFormProps {
  userId: string;
  postId: string;
  fetchPosts: () => void;
}

const CommentForm: React.FC<CommentFormProps> = ({
  userId,
  postId,
  fetchPosts,
}) => {
  const [comment, setComment] = useState("");
  const [open, setOpen] = React.useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleClose = (
    event: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(!open);
  };

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
        fetchPosts(); // Fetch latest posts to show the new comment
        setOpen(true);
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
        borderRadius: "8px",
        backgroundColor: "#f9f9f9",
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      <Snackbar
        open={open}
        autoHideDuration={5000}
        onClose={handleClose}
        message="Comment was submitted successfully"
      />
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
                bgcolor: "#7a20a2",
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
