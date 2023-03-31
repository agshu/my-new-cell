import React, { useState } from "react";
import video from "../assets/tmaster.mp4";

//TODO: skicka in video som prompt

const Video = () => {
  const [clicked, setClicked] = useState(false);

  function playPause() {
    const myVideo = document.getElementById("video1");
    const videoContainer = document.getElementById("video-cont");
    myVideo.play();
    myVideo.onended = function () {
      myVideo.remove();
      videoContainer.remove();
    };
    setClicked(true);
  }

  return (
    <div className="video-comp" id="video-cont">
      <button
        id="video-btn"
        className={clicked ? "hidden" : "video-btn"}
        onClick={playPause}
      >
        PRESS TO EVOLVE
      </button>
      <video
        id="video1"
        src={video}
        width="100%"
        height="100%"
        muted
        controls
      ></video>
    </div>
  );
};

export default Video;
