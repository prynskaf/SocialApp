import React, { useState, useEffect } from "react";
import { Grid, useTheme, useMediaQuery } from "@mui/material";
import TimeAgo from "react-timeago";
import Likes from "../Likes/Likes";
import Comments from "../Comments/Comments";

interface Post {
  _id: string;
  content: string;
  imageUrls: string[];
  user?: User;
  timestamp: string;
  likes: Array<{ _id: string }>;
}

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  imageUrls?: string[];
}

const PostCard: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [posts, setPosts] = useState<Post[]>([]);

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

  posts.map((post) => {
    console.log("NAME: " + `${post.user?.firstName} ${post.user?.lastName}`);
  });

  const handleLike = (post: Post) => {
    const userId = post.user?._id;
    const postId = post._id;

    fetch("/api/likes/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user_id: userId, post_id: postId }),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error("Failed to like the post");
      })
      .then((data) => {
        console.log("Like successful:", data);
      })
      .catch((error) => console.error("Error liking the post:", error));
  };

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
            <h4>
              {post.user
                ? `${post.user.firstName} ${post.user.lastName}`
                : "Anonymous"}
            </h4>
            {post.user?.imageUrls && post.user.imageUrls.length > 0 && (
              <img
                src={post.user.imageUrls[0] || ""}
                alt="User"
                style={{ width: "50px", height: "50px", borderRadius: "50%" }}
              />
            )}
            <h6>
              <TimeAgo date={post.timestamp} />
            </h6>
            <br />
            <p
              style={{
                marginBottom: "10px",
                maxWidth: "100%",
                whiteSpace: "pre-wrap",
              }}
            >
              {post.content}
            </p>
            {post.imageUrls &&
              post.imageUrls.length > 0 &&
              post.imageUrls.map((imageUrl, index) => (
                <img
                  key={index}
                  src={imageUrl}
                  alt={`Post Image ${index}`}
                  style={{
                    width: "100%",
                    height: "auto",
                    marginBottom: "10px",
                  }}
                />
              ))}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                width: "100%",
                alignItems: "center",
                gap: "10px",
                fontWeight: "bold",
                fontSize: isMobile ? "10px" : "12px",
              }}
            >
              <Likes post={post} onLike={() => handleLike(post)} />
              <Comments />
              <p>8 comments</p>
            </div>
          </div>
        ))}
      </Grid>
    </Grid>
  );
};

export default PostCard;
