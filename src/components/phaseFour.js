import React, { useEffect, useRef, useState } from "react";
import { MindARThree } from "mind-ar/dist/mindar-image-three.prod.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import * as THREE from "three";
import target from "../assets/target2.mind";
import cell from "../assets/models/modelFive.glb";
import Modal from "./modal";
import { ref, update, child, get } from "firebase/database";
import { database, auth } from "../firebase";

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

  async function updateUserData(userId) {
    const userRef = ref(database, "users/" + userId);
    try {
      await update(userRef, {
        clickedButton: [
          ...((await get(child(userRef, "clickedButton"))).val() || []),
          "Phase four: " + Date(),
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

      const ambientLight = new THREE.AmbientLight(0xffffff);
      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
      scene.add(ambientLight, directionalLight);

      const gltf = await loadGTLF(cell);
      gltf.scene.rotation.y = Math.PI;
      gltf.scene.rotation.x = 0.7;

      gltf.scene.scale.set(1, 1, 1);
      gltf.scene.position.set(0, 0, 0);
      gltf.scene.userData.clickable = true;

      const anchor = mindarThree.addAnchor(0);
      anchor.group.add(gltf.scene);

      //animation
      const mixer = new THREE.AnimationMixer(gltf.scene);
      const action = mixer.clipAction(gltf.animations[0]);
      action.play();
      const clock = new THREE.Clock();

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
                }
              }
            }
          } else {
            setShow(true);
            updateUserData(auth.currentUser.uid);
          }
        });
      };

      anchor.onTargetLost = () => {};

      await mindarThree.start();
      renderer.setAnimationLoop(() => {
        const delta = clock.getDelta();
        mixer.update(delta);
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
      <div className="fas-h1">FAS 5: UTVECKLAD VARELSE</div>
      <Modal
        title="Utvecklad varelse"
        onClose={() => setShow(false)}
        show={show}
      >
        <p>
          Wow! Cellen har gått från att vara ensam stamcell till att bli en
          blobb till… en söt kanin!
          <br />
          <br />
          <b>Nu kommer det snart ett mail</b> med en enkät från mig till den
          mail-adress du skrev upp dig med. Det är jätteviktigt för min
          forskning att du som testat appen svarar på den så snart som möjligt.
          Både barn och vuxna kan vara med och svara på samma formulär.
          <br />
          <br />
          Stort tack för att du varit med och testat den här prototypen!
        </p>
      </Modal>
    </div>
  );
};

export default PhaseFour;
