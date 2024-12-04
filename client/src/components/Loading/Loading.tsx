import React from "react";

const Loading = () => {
  return (
    <div>
      <img
        src="./Loading.gif"
        alt="loading.gif"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          background: "transparent",
        }}
      />
    </div>
  );
};

export default Loading;
