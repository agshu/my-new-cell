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
        if (timeDiff > 3600000 && timeDiff < 7200000) {
          // en  minut är 60 000
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
    <div>
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
              <AuthRoute>
                <div>
                  {phaseZero && <PhaseZero />}
                  {phaseOne && <PhaseOne />}
                  {phaseTwo && <PhaseTwo />}
                  {phaseThree && <PhaseThree />}
                  {phaseFour && <PhaseFour />}
                </div>
                {/* {
                  <div>
                    {showBox && <NegativePhase />}
                    {showBox && (
                      <div className="start">
                        <h1>Håll scannern över bilden på kortet</h1>
                        <button className="ok-btn" onClick={handleUnmount}>
                          Ok
                        </button>
                      </div>
                    )}
                    {phaseZero && !showBox && <PhaseZero />}
                    {phaseOne && !showBox && <PhaseOne />}
                    {phaseTwo && !showBox && <PhaseTwo />}
                    {phaseThree && !showBox && <PhaseThree />}
                    {phaseFour && !showBox && <PhaseFour />}
                  </div>
                } */}
              </AuthRoute>
            }
          />
        </Routes>
      </HashRouter>
    </div>
  );
}

export default App;
