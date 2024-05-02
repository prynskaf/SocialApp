import { Box, Grid, useMediaQuery, useTheme } from "@mui/material";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import LoginIcon from "@mui/icons-material/Login";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/clerk-react";

const Navbar = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

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
        // position: "fixed",
      }}
    >
      {/* Search input centered */}
      <Grid item>
        <input
          type="search"
          placeholder="search post..."
          style={{
            width: "100%",
            height: "40px",
            borderRadius: "20px",
            border: "none",
            padding: isSmallScreen ? "0 10px" : "0 70px",
            fontSize: "20px",
            outline: "none",
            boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.2)",
          }}
        />
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
