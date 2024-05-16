import React from "react";
import AddCommentIcon from "@mui/icons-material/AddComment";

const Comments = () => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "7px",
      }}
    >
      <AddCommentIcon />
      <p>Comments</p>
    </div>
  );
};

export default Comments;
