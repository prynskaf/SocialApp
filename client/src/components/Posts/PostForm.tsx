import React, { useState, ChangeEvent, FormEvent } from "react";
import { useClerk } from "@clerk/clerk-react";
import { Grid, useTheme, useMediaQuery } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

const PostForm: React.FC = () => {
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

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    console.log("User Email:", user?.emailAddresses[0].emailAddress);
    console.log("Post Content:", postText);

    if (!postText || postText.trim() === "") {
      console.error("Content is required for the post.");
      return; // Stop execution if no content
    }

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
      } else {
        console.error("Failed to submit post:", response.statusText);
        const errorData = await response.json();
        console.error("Error Details:", errorData.message);
      }
    } catch (error) {
      console.error("Error:", error);
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
              bgcolor: "#D9D9D9",
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
                placeholder="Share a post..."
                style={{
                  width: isMobile ? "300px" : "400px",
                  minHeight: "150px", // Adjusted the minHeight to make the textarea larger
                  borderRadius: "20px",
                  border: "none",
                  padding: isMobile ? "10px" : "20px",
                  fontSize: "16px", // Ensure the font size is at least 16px
                  outline: "none",
                  boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.2)",
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
                    }}
                  >
                    {fileName || "Upload Image"}
                  </label>
                </Grid>
                <Grid item>
                  <button
                    type="submit"
                    style={{
                      backgroundColor: "#00BFFF",
                      border: "none",
                      borderRadius: "10px",
                      padding: "10px 20px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                      fontSize: isMobile ? "10px" : "12px",
                    }}
                  >
                    <SendIcon />
                    Send
                  </button>
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
