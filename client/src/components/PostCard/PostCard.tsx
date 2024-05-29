import React, { useState } from "react";
import { Grid, useTheme, useMediaQuery, Typography } from "@mui/material";
import TimeAgo from "react-timeago";
import Likes from "../Likes/Likes";
import Comments from "../Comments/Comments";
import CommentForm from "../Comments/CommentForm";
import CommentList from "../Comments/CommentList";
import { Post, User } from "../../types";
import { toast } from "sonner";
import DeleteIcon from "@mui/icons-material/Delete";

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
      toast.error("Oops... Log in before you can like this post");
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
  };

  const handleDelete = async (postId: string) => {
    const loadingToastId = toast.loading("Deleting...");

    try {
      const response = await fetch(`/api/posts/${postId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        console.log("Post deleted successfully");
        fetchPosts(); // Fetch latest posts
        toast.dismiss(loadingToastId);
        toast.success("Post was successfully deleted");
      } else {
        console.error("Failed to delete post:", response.statusText);
        const errorData = await response.json();
        console.error("Error Details:", errorData.message);
        toast.dismiss(loadingToastId);
        toast.error(errorData.message);
      }
    } catch (error) {
      console.error("Error:", error);
      toast.dismiss(loadingToastId);
      toast.error("An error occurred while deleting the post.");
    }
  };

  console.log(posts);

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
                justifyContent: "space-between",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {post.user.userImage && post.user.userImage.length > 0 && (
                  <img
                    src={post.user.userImage[0] || ""}
                    alt="User"
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%",
                      marginRight: "10px",
                    }}
                  />
                )}
                <div>
                  <h4>{`${post.user.firstName} ${post.user.lastName}`}</h4>
                  {/* <TimeAgo date={post.timestamp} live={false} /> */}
                  <Typography variant="body2" color="textSecondary">
                    <TimeAgo date={post.timestamp} live={false} />
                  </Typography>
                </div>
              </div>

              {currentUser?._id === post.user._id && (
                <div>
                  <DeleteIcon
                    onClick={() => handleDelete(post._id)}
                    sx={{
                      color: "gray",
                      cursor: "pointer",
                      "&:hover": {
                        color: "red",
                      },
                    }}
                  />
                </div>
              )}
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
                  marginTop: "10px",
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
                    <CommentList
                      post={post}
                      currentUser={currentUser}
                      fetchPosts={fetchPosts}
                    />
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
