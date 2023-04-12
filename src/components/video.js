import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Video = (props) => {
  const [clicked, setClicked] = useState(false);
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(props.route);
  };

  function playPause() {
    const myVideo = document.getElementById("video1");
    const videoContainer = document.getElementById("video-cont");
    myVideo.play();
    myVideo.onended = async function () {
      // myVideo.remove();
      // await videoContainer.remove();
      handleClick();
    };
    setClicked(true);
  }

  return (
    <div className="video-comp" id="video-cont">
      <button
        id="video-btn"
        className={clicked ? "hidden" : "real-video-btn"}
        onClick={playPause}
      >
        PRESS TO EVOLVE
      </button>
      <video
        id="video1"
        src={props.video}
        width="100%"
        height="100%"
        muted
      ></video>
    </div>
  );
};

export default Video;
