import { auth, database } from "../firebase";
import { ref, onValue } from "firebase/database";
import React, { useEffect, useRef, useState } from "react";
import { MindARThree } from "mind-ar/dist/mindar-image-three.prod.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import * as THREE from "three";
import target from "../assets/target2.mind";
import cellOne from "../assets/models/modelOne.gltf";
import cellTwo from "../assets/models/modelTwo.gltf";
import cellThree from "../assets/models/modelThree.gltf";
import Video from "../components/video";
import videoOne from "../assets/videos/VideoOneMitosis.mp4";
import videoTwo from "../assets/videos/VideoTwo.mp4";

const Arpage = () => {
  const [phaseZero, setPhaseZero] = useState(true);
  const [phaseOne, setPhaseOne] = useState(false);
  const [phaseTwo, setPhaseTwo] = useState(false);
  const [phaseThree, setPhaseThree] = useState(false);
  const [phaseFour, setPhaseFour] = useState(false);
  const [cellStatus, setCellStatus] = useState(cellOne);
  const [isRunning, setIsRunning] = useState(false);

  const containerRef = useRef(null);

  //const [showText, setShowText] = useState(false); // on click text in model

  function handleVisibilityChange() {
    if (document.hidden) {
    } else {
      const user = auth.currentUser;
      const timeSpent = ref(database, "users/" + user.uid + "/dateLoggedIn/");

      onValue(timeSpent, (snapshot) => {
        const dateValues = snapshot.val();
        const dateTime = Array.isArray(dateValues)
          ? dateValues.slice(-1)[0].timeperiod
          : dateValues.timeperiod;
        const timeDiff = Date.now() - dateTime;
        console.log(timeDiff);
        if (timeDiff > 60000 && timeDiff < 120000) {
          // en  minut
          setPhaseZero(false);
          setPhaseOne(true);
        } else if (timeDiff > 120000 && timeDiff < 180000) {
          // två minuter
          setPhaseZero(false);
          setPhaseOne(false);
          setPhaseTwo(true);
        } else if (timeDiff > 180000 && timeDiff < 240000) {
          // två minuter
          setPhaseZero(false);
          setPhaseTwo(false);
          setPhaseThree(true);
        } else if (timeDiff > 240000) {
          // två minuter
          setPhaseZero(false);
          setPhaseThree(false);
          setPhaseFour(true);
          setCellStatus(cellTwo);
        }
      });
    }
  }
  useEffect(() => {
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  const loadGTLF = (path) => {
    return new Promise((resolve, reject) => {
      const loader = new GLTFLoader();
      loader.load(path, (gltf) => {
        resolve(gltf);
      });
    });
  };

  useEffect(() => {
    async function start() {
      let cell = cellStatus;
      const mindarThree = new MindARThree({
        container: document.body, //body om fullskärm
        imageTargetSrc: target,
      });
      const { renderer, scene, camera } = mindarThree;

      const pointLight = new THREE.PointLight(0xffffff);
      pointLight.position.set(5, 5, 5);
      const ambientLight = new THREE.AmbientLight(0xffffff);
      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
      scene.add(pointLight, ambientLight, directionalLight);

      const gltf = await loadGTLF(cell); // different 3D models for different time periods
      gltf.scene.scale.set(0.2, 0.2, 0.2);
      gltf.scene.position.set(0, 0, 0);
      gltf.scene.userData.clickable = true;

      const anchor = mindarThree.addAnchor(0); // index noll pga först i listan av target markers från mindAR
      anchor.group.add(gltf.scene);

      // för att registerara event handeling
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
                //setShowText(true);
              } else {
                //setShowText(false);
                console.log("utanför"); // TODO: fix
              }
            }
          }
        }
      });

      if (isRunning) {
        console.log("försöker stänga av");
        mindarThree.stop();
        mindarThree.renderer.setAnimationLoop(null);
        setIsRunning(false);
      } else {
        mindarThree.start();
        setIsRunning(true);
      }

      renderer.setAnimationLoop(() => {
        gltf.scene.rotation.x += 0.01;
        gltf.scene.rotation.y += 0.005;
        renderer.render(scene, camera);
      });

      return () => {
        renderer.setAnimationLoop(null);
        mindarThree.stop();
      };
    }
    start();
  }, [cellStatus]);

  return (
    <div>
      {phaseZero && (
        <div className="ar-page" ref={containerRef}>
          PHASE ZERO
        </div>
      )}
      {phaseOne && (
        <div>
          <Video video={videoOne}></Video>
          <div className="ar-page" ref={containerRef}>
            PHASE ONE
          </div>
        </div>
      )}
      {phaseTwo && (
        <div>
          <Video video={videoTwo} />
          <div className="ar-page" ref={containerRef}>
            PHASE Two
          </div>
        </div>
      )}
      {phaseThree && (
        <div>
          <Video video={videoOne} />
          <div className="ar-page" ref={containerRef}>
            PHASE THREE
          </div>
        </div>
      )}
      {phaseFour && (
        <div>
          {/* <Video video={videoTwo} /> */}
          <div id="phaseFour" className="ar-page" ref={containerRef}>
            PHASE Four
          </div>
        </div>
      )}
      {/* <div
        className={showText ? "info-text" : "hidden"}
        style={{
          position: "absolute",
          top: "10rem",
          left: "5rem",
        }}
      >
        {showText && <div>A stem cell</div>}
      </div> */}
    </div>
  );
};

export default Arpage;
