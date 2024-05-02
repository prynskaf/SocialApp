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

      const response = await fetch("http://localhost:8080/api/posts/", {
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
      sx={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        padding: isMobile ? "20px 0" : "0 20px",
        bgcolor: "red",
      }}
    >
      <form onSubmit={handleSubmit}>
        <Grid
          item
          xs={10}
          sm={12}
          md={12}
          sx={{
            width: "100%",
            display: "flex",
            flexWrap: "nowrap",
            alignItems: "center",
            justifyContent: "center",
            gap: "20px",
            bgcolor: "#D9D9D9",
            borderRadius: "20px",
            padding: isMobile ? "20px 40px" : "20px 20px",
          }}
        >
          {user && (
            <img
              src={user.imageUrl}
              alt="Profile"
              style={{
                width: "40px",
                borderRadius: "50%",
                objectFit: "contain",
                marginBottom: isMobile ? "70px" : "100px",
              }}
            />
          )}
          <Grid
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyItems: "center",
              gap: "20px",
            }}
          >
            <textarea
              placeholder="Share a post..."
              style={{
                width: "100%",
                minHeight: "50px",
                maxHeight: "150px",
                borderRadius: "20px",
                border: "none",
                padding: isMobile ? "15px" : "30px 80px",
                fontSize: isMobile ? "14px" : "16px",
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
            <Grid sx={{ display: "flex", gap: "10px" }}>
              <label
                htmlFor="file"
                title={fileName || "Choose a file..."}
                style={{
                  width: "150px",
                  padding: "10px 20px",
                  textAlign: "center",
                  display: "block",
                  backgroundColor: "#C4C4C4",
                  borderRadius: "10px",
                  cursor: "pointer",
                }}
              >
                {fileName || "Upload Image"}
              </label>
              <button
                type="submit"
                style={{
                  display: "flex",
                  alignItems: "center",
                  backgroundColor: "#00BFFF",
                  border: "none",
                  borderRadius: "10px",
                  padding: "10px 20px",
                  cursor: "pointer",
                  gap: "5px",
                }}
              >
                <SendIcon />
                Send
              </button>
            </Grid>
          </Grid>
        </Grid>
      </form>
    </Grid>
  );
};

export default PostForm;
