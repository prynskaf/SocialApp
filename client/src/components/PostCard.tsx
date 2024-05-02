import React, { useState, useEffect } from "react";
import { Grid, useTheme, useMediaQuery } from "@mui/material";

interface Post {
  _id: string;
  content: string;
  imageUrls: string[];
}

const PostCard: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/posts/");
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

    fetchPosts();
  }, []);

  return (
    <Grid
      sx={{
        width: "100%",

        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        padding: isMobile ? "0 20px" : "0 20px",
        gap: "30px",
      }}
    >
      {posts.map((post) => (
        <Grid item key={post._id} xs={12} sm={9} md={6}>
          <div
            style={{
              border: "1px solid #ccc",
              padding: "20px",
              borderRadius: "8px",
            }}
          >
            <p
              style={{
                marginBottom: "10px",
                maxWidth: "100%", // Ensures the paragraph fills its container horizontally
                whiteSpace: "pre-wrap", // Allows text to wrap within the container
              }}
            >
              {post.content}
            </p>

            {post.imageUrls.map((imageUrl, index) => (
              <img
                key={index}
                src={`http://localhost:8080/uploads/${imageUrl}`}
                alt={`Post Image ${index}`}
                style={{
                  width: "100%", // Ensures the image fills its container horizontally
                  height: "auto", // Set a specific height for all images
                  marginBottom: "10px",
                  objectFit: "contain",
                  // Maintain aspect ratio and crop if necessary
                }}
              />
            ))}
          </div>
        </Grid>
      ))}
    </Grid>
  );
};

export default PostCard;
