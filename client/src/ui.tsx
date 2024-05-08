// import { useClerk } from "@clerk/clerk-react";
import { useUser } from "@clerk/clerk-react";
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
  // const { user } = useClerk();
  const { isSignedIn, user } = useUser();
  console.log("testing", isSignedIn, user);
  // console.log("checking:", user.publicMetadata.registered);

  useEffect(() => {
    const registerUser = async (userData: User, clerkId: string) => {
      try {
        const response = await fetch("http://localhost:8080/api/users", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...userData, emailAddress: clerkId }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || response.statusText);
        }

        console.log("User registered successfully");
      } catch (error) {
        console.error("Error registering user:", error);
      }
    };

    const fetchUserData = async () => {
      try {
        if (!user || !user.emailAddresses || user.emailAddresses.length === 0) {
          console.log("User data is missing or invalid");
          return;
        }

        const emailAddress = user?.emailAddresses[0]?.emailAddress;
        console.log("Email address:", emailAddress);
        if (!emailAddress) {
          console.log("Email address is missing or invalid");
          return;
        }

        if (!emailAddress) {
          console.log("Email address is missing or invalid");
          return;
        }

        const url = `http://localhost:8080/api/users?emailAddress=${encodeURIComponent(
          emailAddress
        )}`;
        console.log("Request URL:", url);

        const response = await fetch(url);

        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        const userData = await response.json();

        if (userData.length === 0) {
          const userDataToSend: User = {
            firstName: user.firstName,
            lastName: user.lastName,
            imageUrl: user.imageUrl,
          };
          console.log("User data to send:", userDataToSend);
          registerUser(userDataToSend, emailAddress);
        } else {
          console.log("User is already registered");
        }
      } catch (error) {
        console.error("Error fetching or processing user data:", error);
      }
    };

    fetchUserData();
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
              {user.firstName || ""} {user.lastName || ""} {}
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
