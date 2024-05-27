import React, { useEffect, useState } from "react";
import { Box, Typography, List, ListItem, ListItemText } from "@mui/material";
import { Post, User, Comment } from "../../types";
import TimeAgo from "react-timeago";
import DeleteIcon from "@mui/icons-material/Delete";
import { toast } from "sonner";

interface CommentListProps {
  post: Post;
  currentUser: User | null;
  fetchPosts: () => void; // Add fetchPosts to refresh the post list after deletion
}

const CommentList: React.FC<CommentListProps> = ({
  post,
  currentUser,
  fetchPosts,
}) => {
  const { comments } = post;
  const [users, setUsers] = useState<{ [key: string]: User }>({});

  useEffect(() => {
    // Fetch user data for all unique user IDs in comments
    const fetchUserData = async () => {
      const uniqueUserIds = Array.from(
        new Set(comments.map((comment: Comment) => comment.user))
      );

      try {
        const fetchedUsers = await Promise.all(
          uniqueUserIds.map(async (userId: string) => {
            const response = await fetch(`/api/users/${userId}`);
            if (!response.ok) {
              throw new Error("Failed to fetch user data");
            }
            return response.json();
          })
        );

        // Create a map of user data with user IDs as keys
        const userMap: { [key: string]: User } = {};
        fetchedUsers.forEach((user: User) => {
          userMap[user._id] = user;
        });

        setUsers(userMap);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    if (comments.length > 0) {
      fetchUserData();
    }
  }, [comments]); // Fetch user data whenever the list of comments changes

  // Sort comments from newest to oldest
  const sortedComments = comments
    .slice()
    .sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

  const handleDeleteComment = async (commentId: string) => {
    const loadingToastId = toast.loading("Deleting...");

    try {
      const response = await fetch(`/api/comments/${commentId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        console.log("Comment deleted successfully");
        fetchPosts(); // Fetch latest posts
        toast.dismiss(loadingToastId);
        toast.success("Comment was successfully deleted");
        fetchPosts(); // Fetch latest posts
      } else {
        console.error("Failed to delete comment:", response.statusText);
        const errorData = await response.json();
        console.error("Error Details:", errorData.message);
        toast.dismiss(loadingToastId);
        toast.error(errorData.message);
      }
    } catch (error) {
      console.error("Error:", error);
      toast.dismiss(loadingToastId);
      toast.error("An error occurred while deleting the comment.");
    }
  };

  if (sortedComments.length === 0) {
    return <Typography></Typography>;
  }

  return (
    <Box>
      <List>
        {sortedComments.map((comment: Comment) => (
          <ListItem
            key={comment._id}
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              border: "1px solid #ccc",
              borderRadius: "10px",
              padding: "10px",
              gap: "10px",
              alignItems: "flex-start",
              marginTop: "15px",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                width: "100%",
                fontWeight: "bold",
              }}
            >
              <div>
                <Typography variant="body1" fontWeight="bold">
                  {users[comment.user]
                    ? `${users[comment.user].firstName} ${
                        users[comment.user].lastName
                      }`
                    : "Unknown User"}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  <TimeAgo date={comment.timestamp} live={false} />
                </Typography>
              </div>
              {currentUser?._id === comment.user && (
                <DeleteIcon
                  onClick={() => handleDeleteComment(comment._id)}
                  sx={{
                    color: "gray",
                    cursor: "pointer",
                    "&:hover": {
                      color: "red",
                    },
                  }}
                />
              )}
            </Box>
            <ListItemText
              secondary={
                <Typography
                  component="span"
                  variant="body2"
                  sx={{
                    whiteSpace: "normal",
                    wordBreak: "break-word",
                  }}
                >
                  {comment.content}
                </Typography>
              }
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default CommentList;
