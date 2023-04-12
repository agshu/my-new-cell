import React, { useEffect, useRef, useState } from "react";
import * as ReactDOM from "react-dom";
import { MindARThree } from "mind-ar/dist/mindar-image-three.prod.js";
import * as THREE from "three";
import target from "../assets/target2.mind";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import cell from "../assets/models/modelTwo.gltf";
import Modal from "./modal";
import { ref, update, child, get } from "firebase/database";
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

const PhaseOne = (props) => {
  const containerId = "container1";
  const [show, setShow] = useState(false);

  const navigate = useNavigate();
  const handleClick = () => {
    navigate("/video-two");
  };

  async function updateUserData(userId) {
    const userRef = ref(database, "users/" + userId);
    try {
      await update(userRef, {
        clickedButton: [
          ...((await get(child(userRef, "clickedButton"))).val() || []),
          "Phase one: " + Date(),
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
      //console.log(document.getElementById(containerId));
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
        gltf.scene.rotation.x += 0.01;
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
      <div className="fas-h1">FAS 2: TVÅ STAMCELLER</div>
      <Modal
        title="Första celldelningen"
        onClose={() => setShow(false)}
        show={show}
      >
        <p>
          Nu har din stamcell delat sig för första gången. De två cellerna
          sitter tätt ihop och kommer fortsätta dela på sig tills de blir fler,
          och liknar en blobb av gelé.
          <br />
          <br />
          De två cellerna som du ser är fortfarande stamceller. Och de är
          faktiskt helt identiska. De innehåller likadana beståndsdelar och
          likadant DNA. Men när stamcellerna delat på sig ännu mer kommer de
          börja specialisera sig, och då ser de inte längre likadana ut, och de
          börjar arbeta på olika sätt. Det är som att de skaffar sig yrken!
        </p>
      </Modal>
      {/* <div className={showText ? "info-text" : "hidden"}>
        {showText && <div>A stem cell</div>}
      </div> */}
      {!props.time && props.next && (
        <button className="video-btn" onClick={handleClick}>
          Gå till nästa fas
        </button>
      )}
    </div>
  );
};

export default PhaseOne;
