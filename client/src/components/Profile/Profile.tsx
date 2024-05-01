import { useClerk } from "@clerk/clerk-react";
import { Box, Grid, Typography, useMediaQuery, useTheme } from "@mui/material";
import React, { useEffect } from "react";

interface User {
  firstName: string | null;
  lastName: string | null;
  imageUrl: string | null;
}

const Profile: React.FC = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));
  const { user } = useClerk();
  // console.log(user);

  const registerUser = async (userData: User, clerkId: string) => {
    // Add clerkId parameter
    try {
      const response = await fetch("http://localhost:8080/api/users/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...userData, emailAddress: clerkId }), // Use emailAddress instead of clerkId
      });
      if (response.ok) {
        console.log("User registered successfully");
      } else if (response.status === 400) {
        const data = await response.json();
        if (data.message === "User already exists") {
          console.log("User is already registered");
        } else {
          console.error("Failed to register user:", response.statusText);
        }
      } else {
        console.error("Failed to register user:", response.statusText);
      }
    } catch (error) {
      console.error("Error registering user:", error);
    }
  };

  useEffect(() => {
    if (user && user.emailAddresses && user.emailAddresses.length > 0) {
      const emailAddress = user.emailAddresses[0].emailAddress;
      // console.log("User's email address:", emailAddress);

      // Check if the user already exists
      fetch(
        `http://localhost:8080/api/users?emailAddress=${encodeURIComponent(
          emailAddress
        )}`
      )
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error("Failed to fetch user data");
          }
        })
        .then((userData) => {
          if (userData.length === 0) {
            // User does not exist, register them
            const userDataToSend: User = {
              firstName: user.firstName,
              lastName: user.lastName,
              imageUrl: user.imageUrl,
            };
            registerUser(userDataToSend, emailAddress);
          } else {
            console.log("User is already registered");
          }
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
        });
    }
  }, [user]);

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
      {user ? (
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
          <Typography>Login</Typography>
        </Box>
      )}
    </Grid>
  );
};

export default Profile;
