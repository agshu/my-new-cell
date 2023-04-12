import React, { useState, useEffect } from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import Startpage from "./pages/startpage";
import Infopage from "./pages/infoPage";
import AuthRoute from "./components/authRoute";
import { ref, update, child, get, onValue } from "firebase/database";
import { database, auth } from "./firebase";
import PhaseOne from "./components/phaseOne";
import PhaseTwo from "./components/phaseTwo";
import PhaseThree from "./components/phaseThree";
import PhaseZero from "./components/phaseZero";
import PhaseFour from "./components/phaseFour";
import Video from "./components/video";
import videoOne from "./assets/videos/VideoOneMitosis.mp4";
import videoTwo from "./assets/videos/VideoTwo.mp4";
import videoThree from "./assets/videos/videoThree.mp4";
import videoFour from "./assets/videos/videoFour.mp4";

function App() {
  const [phaseZero, setPhaseZero] = useState(false);
  const [phaseOne, setPhaseOne] = useState(false);
  const [phaseTwo, setPhaseTwo] = useState(false);
  const [phaseThree, setPhaseThree] = useState(false);
  const [phaseFour, setPhaseFour] = useState(false);

  function handleVisibilityChange() {
    if (document.hidden) {
    } else {
      // const user = auth.currentUser;
      // Create a Date object with the local time in Sweden
      const date2 = Date.now() / 1000;
      //const unixTime = new Date();
      // Get the Unix time in seconds by dividing the milliseconds by 1000 and rounding down
      //const date = Math.floor(unixTime.getTime() / 1000);
      //console.log(date);
      //console.log(date2);
      if (date2 < 1681290000) {
        console.log("väntar på 11.00");
        setPhaseZero(true);
      } else if (date2 > 1681290000 && date2 < 1681290300) {
        console.log("väntar på 11.05");
        setPhaseZero(false);
        setPhaseOne(true);
      } else if (date2 > 1681290300 && date2 < 1681290600) {
        setPhaseZero(false);
        setPhaseOne(false);
        setPhaseTwo(true);
      } else if (date2 > 1681290600 && date2 < 1681290900) {
        console.log("hej");
        setPhaseZero(false);
        setPhaseTwo(false);
        setPhaseThree(true);
      } else if (date2 > 1681290900) {
        setPhaseZero(false);
        setPhaseThree(false);
        setPhaseFour(true);
      }
    }
  }
  window.addEventListener("load", function () {
    handleVisibilityChange();
  });

  document.addEventListener("DOMContentLoaded", handleVisibilityChange);

  useEffect(() => {
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  // useEffect(() => {
  //   window.addEventListener("beforeunload", handleVisibilityChange);
  //   return () => {
  //     window.removeEventListener("beforeunload", handleVisibilityChange);
  //   };
  // }, []);

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
            path="/zero-phase"
            element={
              //<Box time={phaseZero}></Box>
              <AuthRoute>
                <div className="container">
                  <PhaseZero
                    time={phaseZero}
                    next={phaseOne || phaseTwo || phaseThree || phaseFour}
                  />
                </div>
              </AuthRoute>
            }
          />
          <Route
            exact
            path="/video-one"
            element={
              <AuthRoute>
                <Video video={videoOne} route="/phase-one" />
              </AuthRoute>
            }
          />
          <Route
            exact
            path="/phase-one"
            element={
              <AuthRoute>
                <div className="container">
                  <PhaseOne
                    time={phaseOne}
                    next={phaseTwo || phaseThree || phaseFour}
                  />
                </div>
              </AuthRoute>
            }
          />
          <Route
            exact
            path="/video-two"
            element={
              <AuthRoute>
                <Video video={videoTwo} route="/phase-two" />
              </AuthRoute>
            }
          />
          <Route
            exact
            path="/phase-two"
            element={
              <AuthRoute>
                <div className="container">
                  <PhaseTwo time={phaseTwo} next={phaseThree || phaseFour} />
                </div>
              </AuthRoute>
            }
          />
          <Route
            exact
            path="/video-three"
            element={
              <AuthRoute>
                <Video video={videoThree} route="/phase-three" />
              </AuthRoute>
            }
          />
          <Route
            exact
            path="/phase-three"
            element={
              <AuthRoute>
                <div className="container">
                  <PhaseThree time={phaseThree} next={phaseFour} />
                </div>
              </AuthRoute>
            }
          />
          <Route
            exact
            path="/video-four"
            element={
              <AuthRoute>
                <Video video={videoFour} route="/phase-four" />
              </AuthRoute>
            }
          />
          <Route
            exact
            path="/phase-four"
            element={
              <AuthRoute>
                <div className="container">
                  <PhaseFour time={phaseFour} />
                </div>
              </AuthRoute>
            }
          />
        </Routes>
      </HashRouter>
    </div>
  );
}

export default App;
