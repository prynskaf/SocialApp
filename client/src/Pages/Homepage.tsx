import React, { useState, useEffect } from "react";
import Profile from "../components/Profile/Profile";
import Widget from "../components/Widget/Widget";
import { Grid, useMediaQuery, useTheme } from "@mui/material";
import PostForm from "../components/Posts/PostForm";
import PostCard from "../components/PostCard/PostCard";

const Homepage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [posts, setPosts] = useState([]);

  const fetchPosts = async () => {
    try {
      const response = await fetch("/api/posts/");
      if (response.ok) {
        const data = await response.json();
        setPosts(
          data.sort(
            (a: { timestamp: string }, b: { timestamp: string }) =>
              new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
          )
        );
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
          marginButton: "110px",
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
        <PostCard posts={posts} fetchPosts={fetchPosts} />
      </Grid>
    </Grid>
  );
};

export default Homepage;
