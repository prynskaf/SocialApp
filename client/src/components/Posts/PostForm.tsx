import React, { useState, ChangeEvent, FormEvent } from "react";
import { useClerk } from "@clerk/clerk-react";
// import SendIcon from "@mui/icons-material/Send";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import {
  Button,
  Grid,
  useMediaQuery,
  useTheme,
  Box,
  IconButton,
} from "@mui/material";
import { toast } from "sonner";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import { SendIcon } from "lucide-react";

interface PostFormProps {
  fetchPosts: () => void;
}

const PostForm: React.FC<PostFormProps> = ({ fetchPosts }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { user } = useClerk();
  const [fileName, setFileName] = useState("");
  const [postText, setPostText] = useState("");
  const [emojiPickerVisible, setEmojiPickerVisible] = useState(false);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (file) {
      setFileName(file.name);
    } else {
      setFileName("");
    }
  };

  const handleTextChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setPostText(event.target.value);
  };

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    setPostText((prevText) => prevText + emojiData.emoji);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!postText || postText.trim() === "") {
      console.error("Content is required for the post.");
      return; // Stop execution if no content
    }

    const loadingToastId = toast.loading("Posting...");

    try {
      const formData = new FormData();
      formData.append("userId", user?.id ?? "");
      formData.append("content", postText);

      if (event.currentTarget.image.files[0]) {
        formData.append("image", event.currentTarget.image.files[0]);
      }

      const response = await fetch("/api/posts/", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        console.log("Post submitted successfully");
        setPostText("");
        setFileName("");
        fetchPosts(); // Fetch latest posts
        toast.dismiss(loadingToastId);
        toast.success("Post was successfully posted");
      } else {
        console.error("Failed to submit post:", response.statusText);
        const errorData = await response.json();
        console.error("Error Details:", errorData.message);
        toast.dismiss(loadingToastId);
        toast.error(errorData.message);
      }
    } catch (error) {
      console.error("Error:", error);
      toast.dismiss(loadingToastId);
      toast.error("An error occurred while posting.");
    }
  };

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      sx={{ textAlign: "center", padding: isMobile ? "20px 0" : "0 20px" }}
    >
      <Grid item xs={12} sm={10} md={8} lg={6}>
        <form onSubmit={handleSubmit} style={{ width: "100%" }}>
          <Box
            sx={{
              backgroundColor: "#f9f9f9",
              border: "1px solid #ccc",
              borderRadius: "20px",
              padding: "20px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
            }}
          >
            {user && (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-start",
                  width: "100%",
                }}
              >
                <img
                  src={user.imageUrl}
                  alt="Profile"
                  style={{
                    width: isMobile ? "30px" : "40px",
                    height: isMobile ? "30px" : "40px",
                    borderRadius: "50%",
                    objectFit: "contain",
                    marginBottom: isMobile ? "10px" : 0,
                  }}
                />
              </Box>
            )}
            <Box sx={{ width: "100%" }}>
              <textarea
                required
                placeholder="Share a post..."
                style={{
                  width: "100%",
                  // minHeight: "150px",
                  height: "auto",
                  borderRadius: "10px",
                  padding: "10px",
                  fontSize: "16px", // Ensure the font size is at least 16px
                  outline: "none",
                  resize: "vertical",
                  overflow: "auto",
                }}
                value={postText}
                onChange={handleTextChange}
              />

              <input
                type="file"
                id="file"
                name="image"
                accept="image/jpeg, image/png, image/gif"
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  alignItems: "center",
                  mt: 2,
                  // gap: 1,
                  color: "white",
                }}
              >
                <label
                  htmlFor="file"
                  title={fileName || "Choose a file..."}
                  style={{
                    display: "block",
                    backgroundColor: "#000",
                    borderRadius: "10px",
                    cursor: "pointer",
                    padding: "10px 15px",
                    fontSize: "12px",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    maxWidth: "150px",
                    boxSizing: "border-box",
                    color: "white",
                  }}
                >
                  {fileName || "Upload Image"}
                </label>
                <IconButton
                  onClick={() => setEmojiPickerVisible(!emojiPickerVisible)}
                >
                  <EmojiEmotionsIcon
                    style={{ display: isMobile ? "none" : "block" }}
                  />
                </IconButton>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={!postText.trim()}
                  sx={{
                    backgroundColor: "#7b20a2",
                    color: "#fff",
                    border: "none",
                    borderRadius: "10px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                    fontSize: "12px",
                    "&:hover": {
                      bgcolor: "#7a20a2",
                    },
                  }}
                >
                  <SendIcon />
                </Button>
                {emojiPickerVisible && (
                  <Box
                    sx={{
                      position: "absolute",
                      bottom: "-20%",
                      right: 350,

                      zIndex: 10,
                    }}
                  >
                    <EmojiPicker onEmojiClick={handleEmojiClick} />
                  </Box>
                )}
              </Box>
            </Box>
          </Box>
        </form>
      </Grid>
    </Grid>
  );
};

export default PostForm;
