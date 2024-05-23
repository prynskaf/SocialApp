import React from "react";
import AddCommentIcon from "@mui/icons-material/AddComment";

interface CommentsProps {
  postId: string;
  onClick: () => void;
}

const Comments: React.FC<CommentsProps> = ({ onClick }) => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "7px",
        cursor: "pointer",
      }}
      onClick={onClick}
    >
      <AddCommentIcon />
      <p>Comments</p>
    </div>
  );
};

export default Comments;
