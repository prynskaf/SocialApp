// import { useClerk } from "@clerk/clerk-react";
import { Box, Grid, useMediaQuery, useTheme } from "@mui/material";
import React from "react";

const Widget: React.FC = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));

  // const { user } = useClerk();

  return (
    <Grid
      item
      sx={{
        width: "200px",
        height: "700px",
        // backgroundColor: "#D9D9D9",
        backgroundColor: "#f9f9f9",
        display: isSmallScreen ? "none" : "flex",
        gap: "10px",
        // padding: "10px",
        borderRadius: "20px",
        border: "1px solid #ccc",
        transition: "transform 0.3s ease-in-out", // Smooth scaling
        "&:hover": {
          transform: "scale(1.02)", // Slightly scale up on hover
        },
      }}
    >
      <Box>
        {/* <img
              // src={user.imageUrl}
              src="/widget.png"
              alt="Profile"
              style={{ width: "100%", height: "30px", borderRadius: "50%" }}
            /> */}

        <img
          // src={user.imageUrl}
          src="/widget.png"
          alt="Profile"
          style={{
            width: "100%",
            height: "100%",
            // borderRadius: "50%"
            objectFit: "cover",
            backgroundPosition: "center",
            backgroundSize: "cover",
            borderRadius: "20px",
          }}
        />
      </Box>
      {/* <Box>
            <h3>
              {user.firstName} {user.lastName}
            </h3>
            <p>Posts</p>
            <p>Likes</p>
          </Box> */}

      {/* <Box
          sx={{
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography>Login</Typography>
        </Box> */}
    </Grid>
  );
};

export default Widget;
