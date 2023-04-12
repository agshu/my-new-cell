import React, { useEffect, useState } from "react";
import { MindARThree } from "mind-ar/dist/mindar-image-three.prod.js";
import * as THREE from "three";
import target from "../assets/target2.mind";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import cell from "../assets/models/modelOne.gltf";
import Modal from "./modal";
import image from "../assets/images/cellparts.png";
import { useNavigate } from "react-router-dom";
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

const PhaseOne = (time) => {
  const containerId = "container0";
  const [show, setShow] = useState(false);
  const [SecondShow, setSecondShow] = useState(false);
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/video-one");
  };

  async function updateUserData(userId) {
    const userRef = ref(database, "users/" + userId);
    try {
      await update(userRef, {
        clickedButton: [
          ...((await get(child(userRef, "clickedButton"))).val() || []),
          "Phase zero: " + Date(),
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
        uiScanning: "yes",
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
                  updateUserData(auth.currentUser.uid);
                  setShow(true);
                }
              }
            }
          } else {
            console.log("utanför");
          }
        });
      };

      console.log(SecondShow);
      anchor.onTargetLost = () => {};

      mindarThree.start();
      renderer.setAnimationLoop(() => {
        gltf.scene.rotation.x += 0.01;
        gltf.scene.rotation.y += 0.005;
        renderer.render(scene, camera);
      });

      return () => {
        anchor.group.remove(gltf.scene);
        renderer.setAnimationLoop(null);
        mindarThree.stop();
      };
    }
    start();
  }, []);

  return (
    <div id={containerId}>
      <div className="fas-h1">FAS 1: EN STAMCELL</div>
      {/* <button className="button-modal" onClick={() => setCelly(cellParts)}>
        Se vad som är inuti
      </button> */}
      <Modal title="En stamcell" onClose={() => setShow(false)} show={show}>
        <p>
          När ett djur eller en människa börjar växa består det först bara av
          några få stamceller. Dessa stamceller har en speciell förmåga att
          förvandlas till alla olika sorters celler som behövs i kroppen. Det
          betyder att de till exempel kan bli till hjärnceller, hjärtceller
          eller celler i magen.
          <br />
          <br />
          Men just nu har du bara en enda stamcell framför dig i appen.
          Stamcellen som du ser här kommer att dela på sig och växa. Vad tror du
          att det blir när den växt klart?
          <br />
          <br />
          <button
            className="modal-secondary-btn"
            onClick={() => {
              setSecondShow(true);
              setShow(false);
            }}
          >
            Se insidan av cellen
          </button>
        </p>
      </Modal>
      <Modal
        title="En stamcell"
        onClose={() => {
          setSecondShow(false);
          setShow(false);
        }}
        show={SecondShow}
      >
        <p>
          Här ser du insidan på din stamcell.
          <br />
          <img className="modal-img" src={image}></img>
          <br />
          <b>Cellmembran: </b> Skyddande skal runt cellen. <br />
          <b>Cytoplasma:</b> Vätska inuti cellen.
          <br />
          <b>Cellkärna:</b> Hjärnan i cellen som styr allt.
          <br />
          <b>Nukleol:</b> Del av cellkärnan som hjälper till att göra proteiner.
          <br />
          <b>DNA:</b> Instruktioner för hur cellen ska se ut och fungera.
          <br />
          <b>Mitokondrie:</b> Cellens kraftverk som ger cellen energi.
          <br />
          <b>Endoplasmatiska nätverket: </b>Transportvägar inuti cellen. <br />
          <b>Golgiapparaten:</b> Packar och skickar iväg saker från cellen.{" "}
          <br />
          <b>Lyosom: </b> Cellens sophanteringssystem.
          <br />
          <br />
          <button
            className="modal-secondary-btn"
            onClick={() => {
              setSecondShow(false);
              setShow(true);
            }}
          >
            Tillbaka
          </button>
        </p>
      </Modal>

      {/* <div className={showText ? "info-text" : "hidden"}>
        {showText && <div>A stem cell</div>}
      </div> */}
      {!time.time && time.next && (
        <button className="video-btn" onClick={handleClick}>
          Gå till nästa fas
        </button>
      )}
    </div>
  );
};

export default PhaseOne;
