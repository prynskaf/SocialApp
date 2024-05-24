import React, { useState, ChangeEvent, FormEvent } from "react";
import { useClerk } from "@clerk/clerk-react";
import SendIcon from "@mui/icons-material/Send";
import { Button, Grid, useMediaQuery, useTheme } from "@mui/material";
import { toast } from "sonner";

interface PostFormProps {
  fetchPosts: () => void;
}

const PostForm: React.FC<PostFormProps> = ({ fetchPosts }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { user } = useClerk();
  const [fileName, setFileName] = useState("");
  const [postText, setPostText] = useState("");

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

  // Inside your component
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    console.log("User Email:", user?.emailAddresses[0].emailAddress);
    console.log("Post Content:", postText);

    if (!postText || postText.trim() === "") {
      console.error("Content is required for the post.");
      return; // Stop execution if no content
    }

    const loadingToastId = toast.loading("Posting...");

    try {
      const formData = new FormData();
      formData.append("email", user?.emailAddresses[0].emailAddress ?? "");
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
      sx={{ textAlign: "center", padding: isMobile ? "20px 0" : "0 20px" }} // Center the form vertically
    >
      <Grid item xs={12} sm={10} md={8} lg={6}>
        <form onSubmit={handleSubmit} style={{ width: "100%" }}>
          <Grid
            container
            direction="column"
            justifyContent="center"
            alignItems="center"
            gap={2}
            sx={{
              // bgcolor: "#D9D9D9",
              backgroundColor: "#f9f9f9",
              border: "1px solid #ccc",
              borderRadius: "20px",
              padding: "20px",
            }}
          >
            {user && (
              <Grid
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
              </Grid>
            )}
            <Grid item xs={12}>
              <textarea
                required
                placeholder="Share a post..."
                style={{
                  width: isMobile ? "300px" : "400px",
                  minHeight: "150px",
                  borderRadius: "10px",
                  // border: "1px sollid blue",
                  padding: isMobile ? "10px" : "20px",
                  fontSize: "16px", // Ensure the font size is at least 16px
                  outline: "none",
                  // boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.2)",
                  resize: "none",
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
              <Grid
                container
                justifyContent="flex-end"
                alignItems="center"
                gap="10px"
                mt="5px"
              >
                <Grid item>
                  <label
                    htmlFor="file"
                    title={fileName || "Choose a file..."}
                    style={{
                      display: "block",
                      backgroundColor: "#C4C4C4",
                      borderRadius: "10px",
                      cursor: "pointer",
                      padding: "15px 20px",
                      fontSize: isMobile ? "10px" : "12px",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      maxWidth: isMobile ? "120px" : "150px",
                      boxSizing: "border-box",
                    }}
                  >
                    {fileName || "Upload Image"}
                  </label>
                </Grid>
                <Grid item>
                  <Button
                    type="submit"
                    variant="contained"
                    sx={{
                      backgroundColor: "#7b20a2",
                      color: "#fff",
                      border: "none",
                      borderRadius: "10px",
                      padding: "10px 20px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                      fontSize: isMobile ? "10px" : "12px",
                      "&:hover": {
                        bgcolor: "#7a20a2",
                      },
                    }}
                  >
                    <SendIcon />
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </form>
      </Grid>
    </Grid>
  );
};

export default PostForm;
