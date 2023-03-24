import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { auth, database } from "./firebase";
import { ref, onValue } from "firebase/database";
import Startpage from "./pages/startpage";
import Infopage from "./pages/infoPage";
import Arpage from "./pages/arPage";

function App() {
  const [active, setActive] = useState(false);

  function handleVisibilityChange() {
    if (document.hidden) {
      console.log("dold");
    } else {
      const user = auth.currentUser;
      const timeSpent = ref(database, "users/" + user.uid + "/dateSeconds");
      onValue(timeSpent, (snapshot) => {
        const dateTime = snapshot.val();
        const timeDiff = Date.now() - dateTime;
        if (timeDiff > 120000) {
          console.log(timeDiff);
          setActive(true);
        } else {
          console.log(
            "inte dags än, det är",
            (120000 - timeDiff) / 1000,
            "sekunder kvar"
          );
          setActive(false);
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
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<Startpage />} />
          <Route exact path="/info" element={<Infopage />} />
          <Route exact path="/ar" element={<Arpage />} />
        </Routes>
      </BrowserRouter>
      {/* <div className={active ? "hidden" : "visible"}>
        Vi väntar... och väntar...
      </div>
      <div className={active ? "visible" : "hidden"}>
        BAAAAAAAAAAAAAAAAAAAM!
      </div> */}
    </div>
  );
}

export default App;
