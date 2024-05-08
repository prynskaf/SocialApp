import { useUser } from "@clerk/clerk-react";
import { Box, Grid, Typography, useMediaQuery, useTheme } from "@mui/material";
import React, { useEffect } from "react";

// Define UserData interface with nullable properties
interface UserData {
  firstName: string;
  lastName: string;
  imageUrl: string;
  emailAddress: string;
}

const Profile: React.FC = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));
  const { isSignedIn, user } = useUser();

  useEffect(() => {
    const registerUserInDatabase = async (userData: UserData) => {
      try {
        const response = await fetch("/api/users", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        });

        if (!response.ok) {
          throw new Error("Failed to register user");
        }
      } catch (error) {
        console.error("Registration error:", error);
      }
    };

    if (isSignedIn && user) {
      // Check if the user is new
      const isNewUser = !user.publicMetadata.registrationCompleted;
      console.log("Is new user:", isNewUser);

      // If the user is new, register them in the database
      if (isNewUser) {
        // Extract user information and handle null values
        const userData: UserData = {
          firstName: user.firstName || "",
          lastName: user.lastName || "",
          emailAddress: user?.emailAddresses?.[0]?.emailAddress || "",
          imageUrl: user.imageUrl || "",
        };

        registerUserInDatabase(userData);
      }
    }
  }, [isSignedIn, user]);

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
              src={user?.imageUrl || ""}
              alt="Profile"
              style={{ width: "100%", height: "30px", borderRadius: "50%" }}
            />
          </Box>
          <Box>
            <h3>
              {user.firstName || ""} {user.lastName || ""}{" "}
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
