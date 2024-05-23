import React, { useState } from "react";
import { Grid, useTheme, useMediaQuery } from "@mui/material";
import TimeAgo from "react-timeago";
import Likes from "../Likes/Likes";
import Comments from "../Comments/Comments";
import CommentForm from "../Comments/CommentForm";
import CommentList from "../Comments/CommentList";
import { Post, User } from "../../types";

interface PostCardProps {
  posts: Post[];
  fetchPosts: () => void;
  currentUser: User;
}

const PostCard: React.FC<PostCardProps> = ({
  posts,
  fetchPosts,
  currentUser,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [visibleCommentForm, setVisibleCommentForm] = useState<{
    [key: string]: boolean;
  }>({});

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
        fetchPosts(); // Fetch latest posts
      })
      .catch((error) => console.error("Error liking the post:", error));
  };

  const toggleCommentForm = (postId: string) => {
    setVisibleCommentForm((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  return (
    <Grid
      container
      sx={{
        width: "100%",
        justifyContent: "center",
        padding: isMobile ? "0 20px" : "0 20px",
        gap: "30px",
      }}
    >
      {posts.map((post) => (
        <Grid
          item
          key={post._id}
          xs={12}
          sm={9}
          md={6}
          sx={{ marginBottom: "30px" }}
        >
          <div
            style={{
              border: "1px solid #ccc",
              padding: "20px",
              borderRadius: "8px",
              backgroundColor: "#fff",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "10px",
              }}
            >
              {post.user.imageUrls && post.user.imageUrls.length > 0 && (
                <img
                  src={post.user.imageUrls[0] || ""}
                  alt="User"
                  style={{
                    width: "50px",
                    height: "50px",
                    borderRadius: "50%",
                    marginRight: "10px",
                  }}
                />
              )}
              <div>
                <h4>{`${post.user.firstName} ${post.user.lastName}`}</h4>
                <TimeAgo date={post.timestamp} live={false} />
              </div>
            </div>
            <p style={{ whiteSpace: "pre-wrap" }}>{post.content}</p>
            {post.imageUrls.map((imageUrl, index) => (
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
                alignItems: "center",
              }}
            >
              <Likes post={post} onLike={() => handleLike(post)} />
              <Comments
                postId={post._id}
                onClick={() => toggleCommentForm(post._id)}
              />
            </div>
            {visibleCommentForm[post._id] && (
              <div>
                <CommentForm
                  userId={currentUser._id}
                  postId={post._id}
                  fetchPosts={fetchPosts}
                />
                <CommentList post={post} />
              </div>
            )}
          </div>
        </Grid>
      ))}
    </Grid>
  );
};

export default PostCard;
