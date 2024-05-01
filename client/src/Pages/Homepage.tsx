import Profile from "../components/Profile/Profile";
import Widget from "../components/Widget/Widget";
import { Grid, useMediaQuery, useTheme } from "@mui/material";
import PostForm from "../components/Posts/PostForm.tsx";

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
        flex: "nowrap",
        whiteSpace: "nowrap",
      }}
    >
      <Grid>
        <Profile />
      </Grid>
      <Grid>
        <PostForm />
      </Grid>
      <Grid sx={{}}>
        <Widget />
      </Grid>
    </Grid>
  );
};

export default Homepage;
