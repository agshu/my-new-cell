import React, { useState, useEffect } from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import Startpage from "./pages/startpage";
import Infopage from "./pages/infoPage";
import AuthRoute from "./components/authRoute";
import { auth, database } from "./firebase";
import { ref, onValue } from "firebase/database";
import PhaseOne from "./components/phaseOne";
import PhaseTwo from "./components/phaseTwo";
import PhaseThree from "./components/phaseThree";
import PhaseZero from "./components/phaseZero";
import PhaseFour from "./components/phaseFour";
import Box from "./components/ar.js";
import Box2 from "./components/ar2.js";

function App() {
  const [phaseZero, setPhaseZero] = useState(true);
  const [phaseOne, setPhaseOne] = useState(false);
  const [phaseTwo, setPhaseTwo] = useState(false);
  const [phaseThree, setPhaseThree] = useState(false);
  const [phaseFour, setPhaseFour] = useState(false);
  //const [showBox, setShowBox] = useState(true);

  // const handleUnmount = () => {
  //   setShowBox(false);
  // };

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
        if (timeDiff > 60000 && timeDiff < 7200000) {
          // en  minut är 60 000, <7200000
          setPhaseZero(false);
          setPhaseOne(true);
        } else if (timeDiff > 7200000 && timeDiff < 10800000) {
          // två minuter är 120 000
          setPhaseZero(false);
          setPhaseOne(false);
          setPhaseTwo(true);
        } else if (timeDiff > 10800000 && timeDiff < 14400000) {
          // två minuter 180 000
          setPhaseZero(false);
          setPhaseTwo(false);
          setPhaseThree(true);
        } else if (timeDiff > 14400000) {
          // två minuter 240 000
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
    <div className="App">
      <HashRouter>
        <Routes>
          <Route exact path="/" element={<Startpage />} />
          <Route
            exact
            path="/info"
            element={
              <AuthRoute>
                <Infopage />
              </AuthRoute>
            }
          />
          <Route
            exact
            path="/ar"
            element={
              <div className="container">
                {phaseZero && <PhaseZero />}
                {phaseOne && <PhaseOne />}
                {phaseTwo && <PhaseTwo />}
                {phaseThree && <PhaseThree />}
                {phaseFour && <PhaseFour />}
              </div>
            }
          />
        </Routes>
      </HashRouter>
    </div>
  );
}

export default App;
