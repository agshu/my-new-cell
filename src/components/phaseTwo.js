import React, { useEffect, useRef, useState } from "react";
import * as ReactDOM from "react-dom";
import { MindARThree } from "mind-ar/dist/mindar-image-three.prod.js";
import * as THREE from "three";
import target from "../assets/target2.mind";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import cell from "../assets/models/modelThree.gltf";
import Video from "../components/video";
import videoTwo from "../assets/videos/VideoTwo.mp4";

const loadGTLF = (path) => {
  return new Promise((resolve, reject) => {
    const loader = new GLTFLoader();
    loader.load(path, (gltf) => {
      resolve(gltf);
    });
  });
};

const Box = () => {
  const containerRef = useRef(null);
  const [scanningState, setScanning] = useState("yes");

  useEffect(() => {
    async function start() {
      const mindarThree = new MindARThree({
        container: containerRef.current,
        imageTargetSrc: target,
        uiScanning: "no",
      });

      const { renderer, scene, camera } = mindarThree;

      const pointLight = new THREE.PointLight(0xffffff);
      pointLight.position.set(5, 5, 5);
      const ambientLight = new THREE.AmbientLight(0xffffff);
      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
      scene.add(pointLight, ambientLight, directionalLight);

      const gltf = await loadGTLF(cell);
      gltf.scene.scale.set(0.2, 0.2, 0.2);
      gltf.scene.position.set(0, 0, 0);
      gltf.scene.userData.clickable = true;

      const anchor = mindarThree.addAnchor(0);
      anchor.group.add(gltf.scene);

      mindarThree.start();
      renderer.setAnimationLoop(() => {
        renderer.render(scene, camera);
      });

      return () => {
        console.log("tjena");
        renderer.setAnimationLoop(null);
        mindarThree.stop();
      };
    }
    start();
  }, [scanningState]);

  return (
    <div>
      <Video video={videoTwo} />
      <div
        className="arOne"
        style={{ width: "100hw", height: "80vh" }}
        ref={containerRef}
      >
        PHASE TWO
      </div>
    </div>
  );
};

export default Box;
