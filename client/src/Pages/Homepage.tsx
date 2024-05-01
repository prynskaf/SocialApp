import React from "react";
import Profile from "../components/Profile/Profile";
import Post from "../components/Posts/Post";
import Widget from "../components/Widget/Widget";
import { Grid, useMediaQuery, useTheme } from "@mui/material";

const Homepage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  return (
    <Grid
      container
      // item
      component="main"
      sx={{
        width: "100%",
        display: "flex",
        py: isMobile ? null : "30px",
        justifyContent: isMobile ? "center" : "space-between",
        // justifyContent: "space-between",
        px: "20px",
        // gap: "30px",
      }}
    >
      <Grid>
        <Profile />
      </Grid>
      <Grid>
        <Post />
      </Grid>
      <Grid sx={{}}>
        <Widget />
      </Grid>
    </Grid>
  );
};

export default Homepage;
