import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navigation from "./components/Navigation";
import PostEffectsSample from "./pages/PostEffectsSample";
import Test2D from "./pages/Test2D";
import Test3D from "./pages/Test3D";
import BulgeTextEffect from "./pages/BulgeTextEffect";
import { Leva } from "leva";

import "./App.css";

function App() {
  return (
    <Router>
      <div style={{ position: "relative", width: "100vw", height: "100vh" }}>
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
          }}
        >
          <Routes>
            <Route path="/" element={<PostEffectsSample />} />
            <Route path="/test2d" element={<Test2D />} />
            <Route path="/test3d" element={<Test3D />} />
            <Route path="/bulge-text" element={<BulgeTextEffect />} />
          </Routes>
        </div>
        <Navigation />
      </div>
    </Router>
  );
}

export default App;
