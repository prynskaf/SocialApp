import React, { useState, useEffect } from "react";
import Profile from "../components/Profile/Profile";
import Widget from "../components/Widget/Widget";
import { Grid, useMediaQuery, useTheme } from "@mui/material";
import PostForm from "../components/Posts/PostForm";
import PostCard from "../components/PostCard/PostCard";
import { Post, User } from "../types";
import { useUser } from "@clerk/clerk-react";

const Homepage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [posts, setPosts] = useState<Post[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const { user } = useUser();

  console.log("currentUser: ", currentUser);
  console.log(
    "User Email from homepage:",
    user?.emailAddresses[0].emailAddress
  );

  const fetchPosts = async () => {
    try {
      const response = await fetch("/api/posts/");
      if (response.ok) {
        const data = await response.json();
        const postsWithComments = await Promise.all(
          data.map(async (post: Post) => {
            const commentsResponse = await fetch(
              `/api/posts/${post._id}/comments`
            );
            if (commentsResponse.ok) {
              post.comments = await commentsResponse.json();
            } else {
              post.comments = [];
            }
            return post;
          })
        );
        setPosts(
          postsWithComments.sort(
            (a, b) =>
              new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
          )
        );

        if (
          postsWithComments.length > 0 &&
          user?.emailAddresses &&
          user.emailAddresses.length > 0
        ) {
          setCurrentUser({
            ...postsWithComments[0].user,
            emailAddress: user?.emailAddresses[0]?.emailAddress,
          });
        }
      } else {
        console.error("Failed to fetch posts:", response.statusText);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <Grid
      container
      item
      component="main"
      sx={{
        width: "100%",
        display: "flex",
        py: isMobile ? null : "30px",
        px: "20px",
        flex: "nowrap",
        whiteSpace: "nowrap",
      }}
    >
      <Grid
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "30px",
          marginBottom: "110px",
        }}
      >
        <Profile />
        <Widget />
      </Grid>
      <Grid
        style={{
          display: "flex",
          flex: "1",
          width: "100%",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "30px",
        }}
      >
        <PostForm fetchPosts={fetchPosts} />

        <PostCard
          posts={posts}
          fetchPosts={fetchPosts}
          currentUser={currentUser}
        />
      </Grid>
    </Grid>
  );
};

export default Homepage;
