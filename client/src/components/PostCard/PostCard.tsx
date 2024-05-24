import React, { useState } from "react";
import { Grid, useTheme, useMediaQuery } from "@mui/material";
import TimeAgo from "react-timeago";
import Likes from "../Likes/Likes";
import Comments from "../Comments/Comments";
import CommentForm from "../Comments/CommentForm";
import CommentList from "../Comments/CommentList";
import { Post, User } from "../../types";
import { toast } from "sonner";

interface PostCardProps {
  posts: Post[];
  fetchPosts: () => void;
  currentUser: User | null;
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
    if (!currentUser || !currentUser._id) {
      toast.error("Oops... Signin before you can like this post");
      return;
    }

    const userId = currentUser._id;
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
        toast.success("Post liked successfully");
      })
      .catch((error) => {
        console.error("Error liking the post:", error);
        toast.error("An error occurred while liking the post");
      });
  };

  const toggleCommentForm = (postId: string) => {
    setVisibleCommentForm((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
    fetchPosts();
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
                fontWeight: "bold",
                fontSize: isMobile ? "10px" : "12px",
              }}
            >
              <Likes post={post} onLike={() => handleLike(post)} />
              <Comments
                postId={post._id}
                onClick={() => toggleCommentForm(post._id)}
              />
              {!visibleCommentForm[post._id] && (
                <p
                  style={{ cursor: "pointer", color: "blue" }}
                  onClick={() => toggleCommentForm(post._id)}
                >
                  {post.comments.length} comments
                </p>
              )}
            </div>
            {visibleCommentForm[post._id] && (
              <>
                {currentUser && currentUser && (
                  <div>
                    <CommentForm
                      user={currentUser}
                      postId={post._id}
                      fetchPosts={fetchPosts}
                      userEmail={currentUser.emailAddress}
                    />
                    <CommentList post={post} />
                  </div>
                )}
              </>
            )}
          </div>
        </Grid>
      ))}
    </Grid>
  );
};

export default PostCard;
