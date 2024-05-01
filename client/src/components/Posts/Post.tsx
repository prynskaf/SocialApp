import { useClerk } from "@clerk/clerk-react";
import { Box, Grid, useTheme, useMediaQuery } from "@mui/material";
import React, { useState, ChangeEvent } from "react";
import SendIcon from "@mui/icons-material/Send";

const Post: React.FC = () => {
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

  return (
    <Grid
      sx={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        padding: isMobile ? "20px" : "0 20px",
      }}
    >
      <Grid
        container
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
              maxHeight: "150px", // Maximum height before scrolling
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
                backgroundColor: "#fff",
                color: "#000",
                borderRadius: "10px",
                cursor: "pointer",
                boxShadow: "0px 2px 5px rgba(0,0,0,0.1)",
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
                fontSize: "14px",
              }}
            >
              {fileName || "Choose a file..."}
            </label>

            <button
              type="submit"
              style={{
                outline: "none",
                backgroundColor: "white",
                padding: "0 0.5em",
                borderRadius: "10px",
                border: "none",
                fontSize: "15px",
                cursor: "pointer",
              }}
            >
              <SendIcon
                style={{
                  cursor: "pointer",
                }}
              />
            </button>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Post;
