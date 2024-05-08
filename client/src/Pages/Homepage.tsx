import React from "react";
import Profile from "../components/Profile/Profile";
import Widget from "../components/Widget/Widget";
import { Grid, useMediaQuery, useTheme } from "@mui/material";
import PostForm from "../components/Posts/PostForm.tsx";
import PostCard from "../components/PostCard/PostCard.tsx";

const Homepage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  return (
    <Grid
      container
      item
      component="main"
      sx={{
        width: "100%",
        display: "flex",
        py: isMobile ? null : "30px",
        // justifyContent: isMobile ? "center" : "space-between",
        // justifyContent: "space-between",
        px: "20px",
        // gap: "30px",
        flex: "nowrap",
        whiteSpace: "nowrap",
      }}
    >
      <Grid
        sx={{
          display: "flex",
          flexDirection: "column",
          // justifyContent: "flex-start",
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
        <PostForm />
        <PostCard />
      </Grid>
    </Grid>
  );
};

export default Homepage;
