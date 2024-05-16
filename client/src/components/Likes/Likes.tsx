import React from "react";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";

interface LikesProps {
  post: {
    _id: string;
    likes: Array<{ _id: string }>; // Assuming likes are an array of objects with an _id
  };
  onLike: (postId: string) => void; // Function that takes a postId and does not return anything
}

const Likes: React.FC<LikesProps> = ({ post, onLike }) => {
  const handleLike = () => {
    onLike(post._id);
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "7px",
      }}
    >
      <ThumbUpIcon style={{ fontSize: "20px" }} onClick={handleLike} />
      {/* likes lenngth to show the number of lieks  per post */}
      <span>{post.likes.length} Likes</span>
    </div>
  );
};

export default Likes;
