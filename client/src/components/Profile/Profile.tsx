import { useUser } from "@clerk/clerk-react";
import { Box, Grid, Typography, useMediaQuery, useTheme } from "@mui/material";
import React, { useEffect } from "react";

// Define UserData interface with nullable properties
interface UserData {
  _id: string;
  firstName: string;
  lastName: string;
  userImage?: string;
  emailAddress: string;
}

interface ProfileProps {
  fetchPosts: () => void;
}

// user_2fowuBhvgizKKgpgDGNL8w4GxkQ

const Profile: React.FC<ProfileProps> = ({ fetchPosts }) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));
  const { isSignedIn, user } = useUser();
  // console.log(user?.imageUrl);

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
          _id: user.id,
          firstName: user.firstName || "",
          lastName: user.lastName || "",
          emailAddress: user?.emailAddresses?.[0]?.emailAddress || "",
          userImage: user.imageUrl || "",
        };

        registerUserInDatabase(userData);
      }
      fetchPosts(); // Fetch the latest posts
    }
  }, [isSignedIn, user, fetchPosts]);

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
