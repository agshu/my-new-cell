import React, { useEffect, useState } from "react";
import { auth, database } from "../firebase";
import { ref, onValue } from "firebase/database";
import PhaseOne from "../components/phaseOne";
import PhaseZero from "../components/phaseZero";
import PhaseTwo from "../components/phaseTwo";
import PhaseThree from "../components/phaseThree";
import PhaseFour from "../components/phaseFour";

const Arpage = () => {
  const [phaseZero, setPhaseZero] = useState(true);
  const [phaseOne, setPhaseOne] = useState(false);
  const [phaseTwo, setPhaseTwo] = useState(false);
  const [phaseThree, setPhaseThree] = useState(false);
  const [phaseFour, setPhaseFour] = useState(false);

  function handleVisibilityChange() {
    if (document.hidden) {
    } else {
      const user = auth.currentUser;
      const timeSpent = ref(database, "users/" + user.uid + "/dateLoggedIn/");

      onValue(timeSpent, (snapshot) => {
        const dateValues = snapshot.val();
        const dateTime = dateValues.slice(-1)[0].timeperiod;
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
          console.log("över");
          setPhaseZero(false);
          setPhaseThree(false);
          setPhaseFour(true);
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

  return (
    <div>
      {phaseZero && <PhaseZero />}
      {phaseOne && <PhaseOne />}
      {phaseTwo && <PhaseTwo />}
      {phaseThree && <PhaseThree />}
      {phaseFour && <PhaseFour />}
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
