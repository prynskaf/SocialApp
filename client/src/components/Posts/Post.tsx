import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useClerk } from "@clerk/clerk-react";
import { Grid, useTheme, useMediaQuery } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

interface Post {
  _id: string;
  content: string;
  imageUrls: string[];
}

const Post: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const { user } = useClerk();
  const [fileName, setFileName] = useState("");
  const [postText, setPostText] = useState("");
  const [posts, setPosts] = useState<Post[]>([]);
  console.log(posts);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch("/api/posts");
      if (response.ok) {
        const data = await response.json();
        setPosts(data);
      } else {
        console.error("Failed to fetch posts:", response.statusText);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

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
    // Check if postText is not empty
    if (!postText || postText.trim() === "") {
      console.error("Content is required for the post.");
      return; // Stop execution if no content
    }

    try {
      const formData = new FormData();
      formData.append("email", user?.emailAddresses[0].emailAddress ?? "");
      console.log("User Email:", user?.emailAddresses[0].emailAddress);

      formData.append("content", postText);
      // Check if an image is selected
      if (event.currentTarget.image.files[0]) {
        formData.append("image", event.currentTarget.image.files[0]);
      } else {
        console.log("No image uploaded with the post.");
      }

      const response = await fetch("http://localhost:8080/api/posts/", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        console.log("Post submitted successfully");
        setPostText("");
        setFileName("");
        fetchPosts(); // Fetch posts again to update the list
      } else {
        console.error("Failed to submit post:", response.statusText);
        // Optionally, log or display error message from the response
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
        padding: isMobile ? "20px" : "0 20px",
      }}
    >
      <form onSubmit={handleSubmit}>
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
      </form>

      {/* Render posts */}
      {/* Render posts */}
      {posts.map((post) => (
        <Grid key={post._id}>
          <p>{post.content}</p>
          {post.imageUrls.length > 0 && (
            <div>
              {post.imageUrls.map((url, index) => (
                <img key={index} src={url} alt={`Post Image ${index}`} />
              ))}
            </div>
          )}
        </Grid>
      ))}
    </Grid>
  );
};

export default Post;
