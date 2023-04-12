import React, { useEffect, useRef } from "react";
import { MindARThree } from "mind-ar/dist/mindar-image-three.prod.js";
import * as THREE from "three";
import target from "../assets/target2.mind";
import { useNavigate } from "react-router-dom";

export default (time) => {
  const containerRef = useRef(null);

  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/ar");
  };

  useEffect(() => {
    const mindarThree = new MindARThree({
      container: containerRef.current,
      imageTargetSrc: target,
      uiScanning: "no",
    });
    const { renderer, scene, camera } = mindarThree;
    const anchor = mindarThree.addAnchor(0);
    const geometry = new THREE.PlaneGeometry(1, 0.55);
    const material = new THREE.MeshBasicMaterial({
      color: "red",
      transparent: true,
      opacity: 0.5,
    });
    const plane = new THREE.Mesh(geometry, material);
    anchor.group.add(plane);

    mindarThree.start();
    renderer.setAnimationLoop(() => {
      renderer.render(scene, camera);
    });

    return () => {
      renderer.setAnimationLoop(null);
      mindarThree.stop();
    };
  }, []);

  return (
    <div style={{ width: "100vw", height: "100vh" }} ref={containerRef}>
      {" "}
      {!time.time && (
        <button className="video-btn" onClick={handleClick}>
          PRESS TO EVOLVE
        </button>
      )}
    </div>
  );
};
