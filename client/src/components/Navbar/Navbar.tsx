import React from "react";
import { Box, Grid, Typography, useMediaQuery, useTheme } from "@mui/material";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import LoginIcon from "@mui/icons-material/Login";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const navigage = useNavigate();

  const handleNavigate = () => {
    navigage("/");
  };
  return (
    <Grid
      container
      item
      component="nav"
      sx={{
        bgcolor: "#D9D9D9",
        py: "20px",
        px: isSmallScreen ? "20px" : "40px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        position: "fixed",
        zIndex: "10",
      }}
    >
      {/* Search input centered */}
      <Grid item onClick={handleNavigate} sx={{ cursor: "pointer" }}>
        <Typography sx={{ fontWeight: "bold", fontSize: "1.5rem" }}>
          <span style={{ color: "#8432A7", fontWeight: "bolder" }}>S</span>
          ocial
          <span style={{ color: "#8432A7", fontWeight: "bolder" }}>C</span>
          onnect
        </Typography>
      </Grid>

      {/* Notification icon and sign-in/sign-out buttons aligned to the right */}
      <Grid
        item
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          flexDirection: "row",
          gap: "5px",
        }}
      >
        <Box>
          <NotificationsActiveIcon
            style={{ fontSize: "30px", cursor: "pointer" }}
          />
        </Box>
        <Box>
          <SignedOut>
            <SignInButton>
              <LoginIcon
                style={{
                  border: "none",
                  backgroundColor: "inherit",
                  cursor: "pointer",
                  fontSize: "30px",
                }}
              />
            </SignInButton>
          </SignedOut>

          <SignedIn>
            <UserButton />
          </SignedIn>
        </Box>
      </Grid>
    </Grid>
  );
};

export default Navbar;
