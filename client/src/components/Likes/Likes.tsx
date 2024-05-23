import React, { useState } from "react";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";

interface LikesProps {
  post: {
    _id: string;
    likes: Array<{ _id: string }>;
  };
  onLike: (postId: string) => void;
}

const Likes: React.FC<LikesProps> = ({ post, onLike }) => {
  const [liked, setLiked] = useState(false);

  const handleLike = () => {
    onLike(post._id);
    setLiked(true);
    setTimeout(() => setLiked(false), 10000); // Reset color after 10 seconds
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "7px",
      }}
    >
      <ThumbUpIcon
        style={{
          fontSize: "20px",
          color: liked ? "blue" : "inherit",
          cursor: "pointer",
        }}
        onClick={handleLike}
      />
      {/* likes length to show the number of likes per post */}
      <span>{post.likes.length} Likes</span>
    </div>
  );
};

export default Likes;
