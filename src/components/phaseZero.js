import React, { useEffect, useRef, useState } from "react";
import * as ReactDOM from "react-dom";
import { MindARThree } from "mind-ar/dist/mindar-image-three.prod.js";
import * as THREE from "three";
import target from "../assets/target2.mind";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import cell from "../assets/models/modelOne.gltf";
import cellParts from "../assets/models/stemcellWithParts.gltf";
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
  //const containerRef = useRef(null);
  const containerId = "container1";
  const [scanningState, setScanning] = useState("yes");
  //const [showText, setShowText] = useState(false); // on click text in model
  const [show, setShow] = useState(false);
  const [celly, setCelly] = useState(cell);
  const [targetFound, setTargetFound] = useState(false);

  useEffect(() => {
    async function start() {
      const mindarThree = new MindARThree({
        container: document.getElementById(containerId),
        imageTargetSrc: target,
        uiScanning: scanningState,
      });
      console.log(document.getElementById(containerId));
      const { renderer, scene, camera } = mindarThree;

      const pointLight = new THREE.PointLight(0xffffff);
      pointLight.position.set(5, 5, 5);
      const ambientLight = new THREE.AmbientLight(0xffffff);
      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
      scene.add(pointLight, ambientLight, directionalLight);

      const gltf = await loadGTLF(celly);
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
                  console.log("här e jag");
                  anchor.group.remove(gltf.scene);
                  setScanning("no");
                  setCelly(cellParts);
                  setShow(true);
                }
              }
            }
          } else {
            anchor.group.remove(gltf.scene);
            setCelly(cell);
            console.log("utanför");
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
  }, [celly]);

  return (
    <div id={containerId}>
      <div className="fas-h1">FAS 1: EN STAMCELL</div>
      <button className="button-modal" onClick={() => setCelly(cellParts)}>
        Se vad som är inuti
      </button>
      <Modal title="En stamcell" onClose={() => setShow(false)} show={show}>
        <p>
          När du börjar växa till att bli en människa består kroppen av bara
          några få stamceller. Dessa stamceller har en speciell förmåga att
          förvandlas till alla olika sorters celler som behövs i kroppen. Det
          betyder att de till exempel kan bli till hjärnceller, hjärtceller
          eller celler i magen.
          <br />
          <br />
          Stemcellen som du ser här kommer alltså att dela på sig och växa, vem
          vet vad det blir i slutändan!
        </p>
      </Modal>
      {/* <div className={showText ? "info-text" : "hidden"}>
        {showText && <div>A stem cell</div>}
      </div> */}
    </div>
  );
};

export default Box;
