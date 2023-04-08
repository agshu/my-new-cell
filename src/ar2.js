import React, { useEffect, useRef } from "react";
import { MindARThree } from "mind-ar/dist/mindar-image-three.prod.js";
import * as THREE from "three";
import target from "./assets/target2.mind";

const Box2 = () => {
  const containerRef = useRef(null);

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
    <div
      style={{ width: "100hw", height: "100vh", zIndex: "3" }}
      ref={containerRef}
    ></div>
  );
};

export default Box2;
