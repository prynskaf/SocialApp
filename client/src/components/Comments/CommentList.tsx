import React, { useEffect, useState } from "react";
import { Box, Typography, List, ListItem, ListItemText } from "@mui/material";
import { Post, User, Comment } from "../../types";
import TimeAgo from "react-timeago";

interface CommentListProps {
  post: Post;
}

const CommentList: React.FC<CommentListProps> = ({ post }) => {
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

  if (sortedComments.length === 0) {
    return <Typography>No comments yet.</Typography>;
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
