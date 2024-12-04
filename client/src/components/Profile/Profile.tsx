import { useUser } from "@clerk/clerk-react";
import { Box, Grid, Typography, useMediaQuery, useTheme } from "@mui/material";
import React, { useEffect, useMemo } from "react";
import { Post, User } from "../../types";

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
  posts: Post[];
  currentUser: User | null;
}

// user_2fowuBhvgizKKgpgDGNL8w4GxkQ

const Profile: React.FC<ProfileProps> = ({
  fetchPosts,
  posts,
  currentUser,
}) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));
  const { isSignedIn, user } = useUser();

  // calcuter the current usrs posts oount
  const userPostCount = useMemo(() => {
    if (!currentUser || !posts) return 0;
    return posts.filter((post) => post.user._id === currentUser._id).length;
  }, [posts, currentUser]);

  // calculate the total number of likes the user has received
  const userLikeCount = useMemo(() => {
    if (!currentUser || !posts) return 0;
    return posts
      .filter((post) => post.user._id === currentUser._id)
      .reduce((totalLikes, post) => totalLikes + (post.likes?.length || 0), 0);
  }, [posts, currentUser]);

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

  if (!isSignedIn && !user) return null;

  return (
    <Grid
      item
      sx={{
        width: "200px",
        height: "200px",
        // bgcolor: "lightgrey",
        backgroundColor: "#f9f9f9",
        border: "1px solid #ccc",
        display: isSmallScreen ? "none" : "flex",
        gap: "10px",
        flexDirection: "column",
        padding: "10px",
        borderRadius: "20px",
        transition: "transform 0.3s ease-in-out", // Smooth scaling
        "&:hover": {
          transform: "scale(1.02)", // Slightly scale up on hover
        },
      }}
    >
      {user && isSignedIn ? (
        <>
          <div style={{ display: "flex", gap: "10px" }}>
            <Box>
              <img
                src={user?.imageUrl || ""}
                alt="Profile"
                style={{ width: "100%", height: "30px", borderRadius: "50%" }}
              />
            </Box>
            <Box>
              <span>
                <h3>
                  {user.firstName || ""} {user.lastName || ""}{" "}
                </h3>
                <p style={{ fontStyle: "italic" }}>@username</p>
              </span>
            </Box>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                // justifyContent: "space-between",
                // alignItems: "center",
                gap: "10px",
                fontStyle: "italic",
              }}
            >
              <p>Posts: {userPostCount}</p>
              <p>Likes: {userLikeCount}</p>
            </Box>
          </div>
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
