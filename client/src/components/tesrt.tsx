import { useUser } from "@clerk/clerk-react";

import { Box, Grid, Typography, useMediaQuery, useTheme } from "@mui/material";
import React from "react";

const Profile: React.FC = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));
  const { isSignedIn, user } = useUser();
  console.log("user:", isSignedIn, user);

  return (
    <Grid
      item
      sx={{
        width: "200px",
        height: "200px",
        backgroundColor: "#D9D9D9",
        display: isSmallScreen ? "none" : "flex",
        gap: "10px",
        padding: "10px",
        borderRadius: "10px",
      }}
    >
      {user && isSignedIn ? (
        <>
          <Box>
            <img
              src={user.imageUrl || ""}
              alt="Profile"
              style={{ width: "100%", height: "30px", borderRadius: "50%" }}
            />
          </Box>
          <Box>
            <h3>
              {user.firstName || ""} {user.lastName || ""}
            </h3>
            <p>Posts</p>
            <p>Likes</p>
          </Box>
        </>
      ) : (
        <Box
          sx={{
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography variant="body1">Login</Typography>
        </Box>
      )}
    </Grid>
  );
};

export default Profile;
