import React, { useEffect, useRef, useState } from "react";
import * as ReactDOM from "react-dom";
import { MindARThree } from "mind-ar/dist/mindar-image-three.prod.js";
import * as THREE from "three";
import target from "../assets/target2.mind";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import cell from "../assets/models/modelTwo.gltf";
import Video from "../components/video";
import videoOne from "../assets/videos/VideoOneMitosis.mp4";
import Modal from "./modal";

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
  const containerId = "container2";
  const [scanningState, setScanning] = useState("yes");
  const [show, setShow] = useState(false);

  useEffect(() => {
    async function start() {
      const mindarThree = new MindARThree({
        container: document.getElementById(containerId),
        imageTargetSrc: target,
        uiScanning: "no",
      });

      console.log(document.getElementById(containerId));
      const { renderer, scene, camera } = mindarThree;

      const pointLight = new THREE.PointLight(0xffffff);
      pointLight.position.set(5, 5, 5);
      const ambientLight = new THREE.AmbientLight(0xffffff);
      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
      scene.add(pointLight, ambientLight, directionalLight);

      const gltf = await loadGTLF(cell);
      //gltf.scene.scale.set(0.2, 0.2, 0.2);
      //gltf.scene.position.set(0, 0, 0);
      gltf.scene.userData.clickable = true;

      const anchor = mindarThree.addAnchor(0);
      anchor.group.add(gltf.scene);

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
  }, [scanningState]);

  return (
    <div id={containerId}>
      {/* <Video video={videoOne} /> */}
      <div>PHASE ONE</div>
      <Modal
        title="Första celldelningen"
        onClose={() => setShow(false)}
        show={show}
      >
        <p>
          Nu har din stamcell delat sig för första gången! De två cellerna
          sitter tätt ihop och kommer fortsätta dela på sig tills de blir en
          blobb av celler.
          <br />
          <br />
          Innehållet i de två cellerna som du ser nu är identiskt. Det är samma
          beståndsdelar och samma DNA! Men när stamcellerna delat på sig ännu
          mer kommer de börja specialisera sig, och då ser de inte längre
          likadana ut.
        </p>
      </Modal>
    </div>
  );
};

export default Box;
