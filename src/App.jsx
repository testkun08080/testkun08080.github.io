import React, { useRef, useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import NotFound from "./pages/NotFound";
import LogoSamples from "./pages/LogoSamples";

function App() {
  const [showHeader, setShowHeader] = useState(true); // ヘッダーの表示/非表示を制御
  const rootRef = useRef(null); // `root` 要素の参照

  return (
    <Router>
      <div ref={rootRef} className="flex flex-col justify-center min-h-screen">
        {/* <Hero /> */}
        <main>
          <Routes>
            <Route path="/" element={<LogoSamples />} />
            {/* <Route path="*" element={<NotFound />} /> */}
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
