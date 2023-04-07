import React, { useState, useEffect } from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import Startpage from "./pages/startpage";
import Infopage from "./pages/infoPage";
import Arpage from "./pages/arPage";
import AuthRoute from "./authRoute";
import { auth, database } from "./firebase";
import TestPage from "./pages/testPage";
import { ref, onValue } from "firebase/database";

function App() {
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
                <Arpage />
              </AuthRoute>
            }
          />
        </Routes>
      </HashRouter>
    </div>
  );
}

export default App;
