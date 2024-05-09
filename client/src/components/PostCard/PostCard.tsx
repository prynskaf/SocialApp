import React, { useState, useEffect } from "react";
import { Grid, useTheme, useMediaQuery } from "@mui/material";
import TimeAgo from "react-timeago";
// import { useUser } from "@clerk/clerk-react";

interface Post {
  _id: string;
  content: string;
  imageUrls: string[];
  user?: User;
  timestamp: string;
}

interface User {
  firstName: string;
  lastName: string;
  imageUrls?: string[]; // Make imageUrls optional or ensure they are always an array.
}

const PostCard: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [posts, setPosts] = useState<Post[]>([]);
  // const { isSignedIn, user } = useUser();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("/api/posts/");
        if (response.ok) {
          const data = await response.json();
          setPosts(
            data.sort(
              (a: { timestamp: string }, b: { timestamp: string }) =>
                new Date(b.timestamp).getTime() -
                new Date(a.timestamp).getTime()
            )
          );
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
        // border: "1px solid #ccc",
      }}
    >
      <Grid item xs={12} sm={9} md={6}>
        {posts.map((post) => (
          <div
            key={post._id}
            style={{
              border: "1px solid #ccc",
              padding: "20px",
              borderRadius: "8px",
              marginTop: "30px",
              paddingTop: "20px",
            }}
          >
            {/* {post.user.firstName} */}
            <h4>
              {post.user
                ? `${post.user.firstName} ${post.user.lastName}`
                : "Anonymous"}
            </h4>
            {post.user?.imageUrls && post.user.imageUrls.length > 0 && (
              <img
                src={post.user.imageUrls[0]}
                alt="User"
                style={{ width: "50px", height: "50px", borderRadius: "50%" }}
              />
            )}
            <h6>
              {" "}
              <TimeAgo date={post.timestamp} />
            </h6>
            <br />
            <p
              style={{
                marginBottom: "10px",
                maxWidth: "100%", // Ensures the paragraph fills its container horizontally
                whiteSpace: "pre-wrap", // Allows text to wrap within the container
              }}
            >
              {post.content}
            </p>

            {post.imageUrls &&
              post.imageUrls.length > 0 &&
              post.imageUrls.map((imageUrl, index) => (
                <img
                  key={index}
                  src={`https://socialapp-backend-ujiv.onrender.com/uploads/${imageUrl}`}
                  alt={`Post Image ${index}`}
                  style={{
                    width: "100%",
                    height: "auto",
                    marginBottom: "10px",
                  }}
                />
              ))}
          </div>
        ))}
      </Grid>
    </Grid>
  );
};

export default PostCard;
