import React, { useEffect, useState } from "react";
import { MindARThree } from "mind-ar/dist/mindar-image-three.prod.js";
import * as THREE from "three";
import target from "../assets/target2.mind";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import cell from "../assets/models/modelThree.gltf";
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

const PhaseTwo = (props) => {
  const containerId = "container2";
  const [show, setShow] = useState(false);

  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/video-three");
  };

  async function updateUserData(userId) {
    const userRef = ref(database, "users/" + userId);
    try {
      await update(userRef, {
        clickedButton: [
          ...((await get(child(userRef, "clickedButton"))).val() || []),
          "Phase two: " + Date(),
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
      gltf.scene.scale.set(0.05, 0.05, 0.05);
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
      <div className="fas-h1">FAS 3: NY TYP AV CELL</div>
      <Modal
        title="En ny typ av cell"
        onClose={() => setShow(false)}
        show={show}
      >
        <p>
          Wow, nu har det dykt upp en ny typ av cell! En stamcell delade sig och
          cellen som bildades bestämde sig plötsligt för att använda en annan
          del av DNA:t än vad stamcellerna gör. Beroende på var den är i blobben
          så slår den på och av olika delar av DNA:t. Det kallas att den
          specialiserar sig och innebär att den börjar arbeta på ett annat sätt
          än stamcellerna.
          <br />
          <br />
          Under de första veckorna av utvecklingen börjar stamcellerna att
          specialisera sig och utvecklas till olika typer av celler. Vissa
          celler blir till muskler, andra till blodceller och så vidare. På så
          sätt bildas alla delar av kroppen gradvis.
          <br />
          <br />
          Nu behöver vi bara fortsätta vänta på att resten av det här embryots
          olika celler ska bildas.
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

export default PhaseTwo;
