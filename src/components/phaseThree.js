import React, { useEffect, useRef, useState } from "react";
import { MindARThree } from "mind-ar/dist/mindar-image-three.prod.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import * as THREE from "three";
import target from "../assets/target2.mind";
import cell from "../assets/models/modelFour.gltf";
import { ref, update, child, get } from "firebase/database";
import Modal from "./modal";
import { useNavigate } from "react-router-dom";
import { database, auth } from "../firebase";

const loadGTLF = (path) => {
  return new Promise((resolve, reject) => {
    const loader = new GLTFLoader();
    loader.load(path, (gltf) => {
      resolve(gltf);
    });
  });
};

const PhaseThree = (props) => {
  const containerId = "container3";
  const [show, setShow] = useState(false);

  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/video-four");
  };

  async function updateUserData(userId) {
    const userRef = ref(database, "users/" + userId);
    try {
      await update(userRef, {
        clickedButton: [
          ...((await get(child(userRef, "clickedButton"))).val() || []),
          "Phase three: " + Date(),
        ],
      });
      console.log("Data added successfully!");
    } catch (error) {
      console.log("Error adding data:", error);
    }
  }

  useEffect(() => {
    async function start() {
      const mindarThree = new MindARThree({
        container: document.getElementById(containerId),
        imageTargetSrc: target,
        filterMinCF: 0.001,
        filterBeta: 0.01,
        missTolerance: 1,
      });
      const { renderer, scene, camera } = mindarThree;

      const pointLight = new THREE.PointLight(0xffffff);
      pointLight.position.set(5, 5, 5);
      const ambientLight = new THREE.AmbientLight(0xffffff);
      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
      scene.add(pointLight, ambientLight, directionalLight);

      const gltf = await loadGTLF(cell);
      gltf.scene.scale.set(0.15, 0.15, 0.15);
      gltf.scene.position.set(0, 0, 0);
      gltf.scene.rotation.x = 0.5;
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
                  updateUserData(auth.currentUser.uid);
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
      <div className="fas-h1">FAS 4: EMBRYO (MASSA CELLER I EN BLOBB)</div>
      <Modal
        title="Ett embryo, som en blobb!"
        onClose={() => setShow(false)}
        show={show}
      >
        <p>
          Nu är många av cellerna specialiserade – men inte alla!
          Människokroppen har faktiskt stamceller hela livet! När vi skadar oss
          eller blir sjuka, behöver kroppen nya celler för att reparera
          skadorna. Stamceller är de som kan bilda dessa nya celler och hjälpa
          oss att läka. Det finns stamceller i många olika delar av kroppen.
          Till exempel i benmärgen, huden och hjärnan. En vuxen kropp består
          alltså av både specialiserade celler och stamceller!
          <br />
          <br />
          Forskare utforskar stamceller hos vuxna för att bättre förstå hur
          stamceller kan användas för att behandla sjukdomar och skador.
          <br />
          <br />
          Men det här är inte en människa. Börjar du kunna se vad din cell
          kommer bli för något?
        </p>
      </Modal>
      {!props.time && props.next && (
        <button className="video-btn" onClick={handleClick}>
          Gå till nästa fas
        </button>
      )}
    </div>
  );
};

export default PhaseThree;
