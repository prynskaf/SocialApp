import { useClerk } from "@clerk/clerk-react";
import { Box, Grid } from "@mui/material";
import { useState } from "react";

const Post = () => {
  const { user } = useClerk();
  const [fileName, setFileName] = useState("");

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFileName(file.name);
    } else {
      setFileName("");
    }
  };

  return (
    // container
    <Box>
      {/* wrapper */}
      <Grid
        sx={{
          display: "flex",
          alignItems: "center",
          gap: "30px",
          bgcolor: "#D9D9D9",
          borderRadius: "20px",
          padding: "20px  40px",
        }}
      >
        {/* imageURL */}
        <Grid sx={{ paddingBottom: "20px" }}>
          {user && (
            <img
              src={user.imageUrl}
              alt="Profile"
              style={{
                width: "40px",
                // height: "30px",
                borderRadius: "50%",
                objectFit: "contain",
              }}
            />
          )}
        </Grid>
        <Grid
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyItems: "center",
            gap: "10px",
          }}
        >
          {/* input for post  */}
          <Grid>
            <input
              type="text"
              placeholder="share a post.."
              style={{
                width: "100%",
                height: "40px",
                borderRadius: "20px",
                border: "none",
                padding: "0 40px",
                fontSize: "20px",
                outline: "none",
                boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.2)",
              }}
            />
          </Grid>
          {/* <Grid sx={{}}>
            <input
              type="file"
              style={{
                width: "100%",
                outline: "none",
                border: "none",
                borderRadius: "20px",
              }}
            />
          </Grid> */}

          <Grid
            sx={{
              width: "100%", // Ensuring the grid takes the full width
              padding: "20px", // Some padding around the input for better spacing
              backgroundColor: "#f0f0f0", // A light grey background
              borderRadius: "10px", // Rounded corners
            }}
          >
            <input
              type="file"
              id="file"
              onChange={handleFileChange}
              style={{ display: "none" }} // Hide the actual input element
            />
            <label
              htmlFor="file"
              style={{
                width: "100%",
                padding: "10px 20px",
                textAlign: "center",
                display: "block",
                backgroundColor: "#1976d2", // MUI's default blue
                color: "white",
                borderRadius: "20px",
                cursor: "pointer",
                boxShadow: "0px 2px 5px rgba(0,0,0,0.1)", // A slight shadow
              }}
            >
              {fileName || "Choose a file..."}
            </label>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Post;
