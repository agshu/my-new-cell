import { auth, database } from "../firebase";
import { ref, onValue } from "firebase/database";
import React, { useEffect, useRef, useState } from "react";

const TestPage = () => {
  //   const [phaseZero, setPhaseZero] = useState(true);
  //   const [phaseOne, setPhaseOne] = useState(false);
  //   const [phaseTwo, setPhaseTwo] = useState(false);
  //   const [phaseThree, setPhaseThree] = useState(false);
  //   const [phaseFour, setPhaseFour] = useState(false);

  //   const containerRef = useRef(null);
  //   const [mindARRunning, setMindARRunning] = useState("yes");

  //   const [showText, setShowText] = useState(false); // on click text in model

  //   function handleVisibilityChange() {
  //     if (document.hidden) {
  //     } else {
  //       const user = auth.currentUser;
  //       const timeSpent = ref(database, "users/" + user.uid + "/dateLoggedIn/");

  //       onValue(timeSpent, (snapshot) => {
  //         const dateValues = snapshot.val();
  //         const dateTime = Array.isArray(dateValues)
  //           ? dateValues.slice(-1)[0].timeperiod
  //           : dateValues.timeperiod;
  //         const timeDiff = Date.now() - dateTime;
  //         console.log(timeDiff);
  //         if (timeDiff > 60000 && timeDiff < 120000) {
  //           // en  minut
  //           setPhaseZero(false);
  //           setPhaseOne(true);
  //         } else if (timeDiff > 120000 && timeDiff < 180000) {
  //           // två minuter
  //           setPhaseZero(false);
  //           setPhaseOne(false);
  //           setPhaseTwo(true);
  //         } else if (timeDiff > 180000 && timeDiff < 240000) {
  //           // två minuter
  //           setPhaseZero(false);
  //           setPhaseTwo(false);
  //           setPhaseThree(true);
  //         } else if (timeDiff > 240000) {
  //           // två minuter
  //           setPhaseZero(false);
  //           setPhaseThree(false);
  //           setPhaseFour(true);
  //         }
  //       });
  //     }
  //   }
  //   useEffect(() => {
  //     document.addEventListener("visibilitychange", handleVisibilityChange);
  //     return () => {
  //       document.removeEventListener("visibilitychange", handleVisibilityChange);
  //     };
  //   }, []);

  //   const loadGTLF = (path) => {
  //     return new Promise((resolve, reject) => {
  //       const loader = new GLTFLoader();
  //       loader.load(path, (gltf) => {
  //         resolve(gltf);
  //       });
  //     });
  //   };

  //   useEffect(() => {
  //     async function start() {
  //       const mindarThree = new MindARThree({
  //         container: document.body, //body om fullskärm
  //         imageTargetSrc: target,
  //       });
  //       const { renderer, scene, camera } = mindarThree;

  //       const pointLight = new THREE.PointLight(0xffffff);
  //       pointLight.position.set(5, 5, 5);
  //       const ambientLight = new THREE.AmbientLight(0xffffff);
  //       const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
  //       scene.add(pointLight, ambientLight, directionalLight);

  //       const gltf = await loadGTLF(phaseZero ? cell : cell); // different 3D models for different time periods
  //       gltf.scene.scale.set(0.2, 0.2, 0.2);
  //       gltf.scene.position.set(0, 0, 0);
  //       gltf.scene.userData.clickable = true;

  //       const anchor = mindarThree.addAnchor(0); // index noll pga först i listan av target markers från mindAR
  //       anchor.group.add(gltf.scene);

  //       mindarThree.start();
  //       renderer.setAnimationLoop(() => {
  //         gltf.scene.rotation.x += 0.01;
  //         gltf.scene.rotation.y += 0.005;
  //         renderer.render(scene, camera);
  //       });

  //       return () => {
  //         renderer.setAnimationLoop(null);
  //         mindarThree.stop();
  //       };
  //     }
  //     start();
  //   }, []);

  return (
    <div>
      <div className="ar-page">heeeej test</div>
    </div>
  );
};

export default TestPage;
