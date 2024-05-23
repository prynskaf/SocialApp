import React, { useEffect, useState } from "react";
import { Box, Typography, List, ListItem, ListItemText } from "@mui/material";
import { Post, User, Comment } from "../../types";

interface CommentListProps {
  post: Post;
}

const CommentList: React.FC<CommentListProps> = ({ post }) => {
  const { comments } = post;
  const [users, setUsers] = useState<{ [key: string]: User }>({});

  useEffect(() => {
    // Fetch user data for all unique user IDs in comments
    const fetchUserData = async () => {
      try {
        const uniqueUserIds = Array.from(
          new Set(comments.map((comment: Comment) => comment.user))
        );

        // Fetch user data for each unique user ID
        const fetchedUsers = await Promise.all(
          uniqueUserIds.map(async (userId: string) => {
            const response = await fetch(`/api/users/${userId}`);
            if (response.ok) {
              const userData = await response.json();
              return userData;
            } else {
              throw new Error("Failed to fetch user data");
            }
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

    fetchUserData();
  }, [comments]); // Fetch user data whenever the list of comments changes

  if (comments.length === 0) {
    return <Typography>No comments yet.</Typography>;
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Comments
      </Typography>
      <List>
        {comments.map((comment: Comment) => (
          <ListItem key={comment._id} alignItems="flex-start">
            <ListItemText
              primary={
                users[comment.user]
                  ? `${users[comment.user].firstName} ${
                      users[comment.user].lastName
                    }`
                  : "Unknown User"
              }
              secondary={comment.content}
            />
            <Typography variant="body2" color="textSecondary">
              {new Date(comment.timestamp).toLocaleString()}
            </Typography>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default CommentList;
