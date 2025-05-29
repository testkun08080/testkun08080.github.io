import { useRef } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import UnderMaintenance from "./pages/UnderMaintenance";
// import LogoSamples from "./pages/LogoSamples";
// import NotFound from "./pages/NotFound";

function App() {
  const rootRef = useRef(null);

  return (
    <Router>
      <div ref={rootRef} className="flex flex-col justify-center min-h-screen">
        {/* <Hero /> */}
        <main>
          <Routes>
            <Route path="/" element={<UnderMaintenance />} />
            {/* <Route path="/logosamples" element={<LogoSamples />} /> */}
            {/* <Route path="*" element={<NotFound />} /> */}
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
