import React from "react";
import ReactPlayer from "react-player";
const videoStream = () => {
  return (
    <ReactPlayer
      url="https://www.youtube.com/watch?v=OXmnrfj2ERc&ab_channel=ABCLearningEnglish"
      className="react-player"
      playing={true}
      width="100%"
      height="100%"
    />
  );
};

export default videoStream;
