import React, { useEffect, useRef, useState } from "react";
import { MindARThree } from "mind-ar/dist/mindar-image-three.prod.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import * as THREE from "three";
import target from "../assets/target2.mind";
import cell from "../assets/models/modelTwo.gltf";
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

const PhaseThree = () => {
  const containerRef = useRef(null);
  const [showText, setShowText] = useState(false); // on click text in model

  useEffect(() => {
    async function start() {
      const mindarThree = new MindARThree({
        container: containerRef.current, //body om fullskärm
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

      const anchor = mindarThree.addAnchor(0); // index noll pga först i listan av target markers från mindAR
      anchor.group.add(gltf.scene);

      // för att registerara event handeling
      containerRef.current.addEventListener("click", (event) => {
        const mouse = new THREE.Vector2();
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(scene.children, true);

        if (intersects.length > 0) {
          let o = intersects[0].object;
          while (o.parent && !o.userData.clickable) {
            o = o.parent;
            if (o.userData.clickable) {
              if (o === gltf.scene) {
                console.log("här e jag");
                setShowText(true);
              } else {
                setShowText(false);
                console.log("utanför"); // TODO: fix
              }
            }
          }
        }
      });

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
    <div>
      <Video video={videoTwo} />
      <div
        className="arOne"
        style={{ width: "100hw", height: "90vh" }}
        ref={containerRef}
      >
        PHASE THREE
      </div>
    </div>
  );
};

export default PhaseThree;
