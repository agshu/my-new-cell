import React from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import Startpage from "./pages/startpage";
import Infopage from "./pages/infoPage";
import Arpage from "./pages/arPage";

function App() {
  return (
    <div>
      <HashRouter>
        <Routes>
          <Route exact path="/" element={<Startpage />} />
          <Route exact path="/info" element={<Infopage />} />
          <Route exact path="/ar" element={<Arpage />} />
        </Routes>
      </HashRouter>
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
