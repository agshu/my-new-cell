import React from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import Startpage from "./pages/startpage";
import Infopage from "./pages/infoPage";
import Arpage from "./pages/arPage";
import AuthRoute from "./authRoute";

function App() {
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
