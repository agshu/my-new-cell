import React, { useEffect, useRef, useState } from "react";
import * as ReactDOM from "react-dom";
import { MindARThree } from "mind-ar/dist/mindar-image-three.prod.js";
import * as THREE from "three";
import target from "../assets/target2.mind";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import cell from "../assets/models/modelOne.gltf";

const loadGTLF = (path) => {
  return new Promise((resolve, reject) => {
    const loader = new GLTFLoader();
    loader.load(path, (gltf) => {
      resolve(gltf);
    });
  });
};

export default () => {
  const containerRef = useRef(null);

  useEffect(() => {
    async function start() {
      const mindarThree = new MindARThree({
        container: containerRef.current,
        imageTargetSrc: target,
      });
      const { renderer, scene, camera } = mindarThree;
      const anchor = mindarThree.addAnchor(0);
      // const geometry = new THREE.PlaneGeometry(1, 0.55);
      // const material = new THREE.MeshBasicMaterial({
      //   color: 0x00ffff,
      //   transparent: true,
      //   opacity: 0.5,
      // });
      // const plane = new THREE.Mesh(geometry, material);
      // anchor.group.add(plane);

      const pointLight = new THREE.PointLight(0xffffff);
      pointLight.position.set(5, 5, 5);
      const ambientLight = new THREE.AmbientLight(0xffffff);
      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
      scene.add(pointLight, ambientLight, directionalLight);

      const gltf = await loadGTLF(cell);
      //gltf.scene.scale.set(0.2, 0.2, 0.2);
      //gltf.scene.position.set(0, 0, 0);
      gltf.scene.userData.clickable = true;
      anchor.group.add(gltf.scene);

      mindarThree.start();
      renderer.setAnimationLoop(() => {
        renderer.render(scene, camera);
      });

      return () => {
        renderer.setAnimationLoop(null);
        mindarThree.stop();
      };
    }
    start();
  }, []);

  return (
    <div style={{ width: "100%", height: "100%" }} ref={containerRef}></div>
  );
};
