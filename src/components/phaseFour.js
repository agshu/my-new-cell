import React, { useEffect, useRef, useState } from "react";
import { MindARThree } from "mind-ar/dist/mindar-image-three.prod.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import * as THREE from "three";
import target from "../assets/target2.mind";
import cell from "../assets/models/modelTwo.gltf";
import Video from "../components/video";
import Modal from "./modal";

const loadGTLF = (path) => {
  return new Promise((resolve, reject) => {
    const loader = new GLTFLoader();
    loader.load(path, (gltf) => {
      resolve(gltf);
    });
  });
};

const PhaseFour = () => {
  const containerId = "container4";
  const [show, setShow] = useState(false);

  useEffect(() => {
    async function start() {
      const mindarThree = new MindARThree({
        container: document.getElementById(containerId),
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
      gltf.scene.scale.set(0.1, 0.1, 0.1);
      gltf.scene.position.set(0, 0.2, 0);
      gltf.scene.userData.clickable = true;

      const anchor = mindarThree.addAnchor(0);
      anchor.group.add(gltf.scene);

      anchor.onTargetFound = () => {
        //för att registerara event handeling
        document.body.addEventListener("click", (event) => {
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
                  setShow(true);
                }
              }
            }
          }
        });
      };

      anchor.onTargetLost = () => {};

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
    <div id={containerId}>
      {/* <Video video={videoOne} /> */}
      <div className="fas-h1">FAS 5: UTVECKLAD VARELSE</div>
      <Modal
        title="Utvecklad varelse"
        onClose={() => setShow(false)}
        show={show}
      >
        <p>
          Wow! Cellen har gått från att vara ensam stamcell till blobb till...
          ja vad är det?
          <br />
          <br />
          Nu kommer det snart ett mail från mig till den mail-adressen du skrev
          upp dig med här. Det är jätteviktigt för min forskning att ni svarar
          på den så snart som möjligt.
          <br />
          <br />
          Stort tack för att du varit med och testat!
        </p>
      </Modal>
    </div>
  );
};

export default PhaseFour;
