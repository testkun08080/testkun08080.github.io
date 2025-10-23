import { useRef } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import UnderMaintenance from "./pages/UnderMaintenance";
import NotFound from "./pages/NotFound";
import Sunaba from "./pages/Sunaba";
import NoiseCanvas from "./components/canvas";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { MenuDrawerProvider } from "./components/MenuDrawerContext";
import MenuDrawer from "./components/MenuDrawer";
import About from "./pages/About";
import Reels from "./pages/Reels";
import Contact from "./pages/Contact";
import Blog from "./pages/Blog";
import BlogDetail from "./pages/BlogDetail";
import TEST from "./pages/test_md";
import TEST2 from "./pages/test_md2";

function App() {
  const rootRef = useRef(null);

  return (
    <MenuDrawerProvider>
      <Router>
        <NoiseCanvas />
        <Header />
        <MenuDrawerContainer />
        <div
          ref={rootRef}
          className="flex flex-col justify-center min-h-screen"
        >
          {/* <Hero /> */}
          <main>
            <Routes>
              <Route path="/" element={<UnderMaintenance />} />
              <Route path="/sunaba" element={<Sunaba />} />
              <Route path="/about" element={<About />} />
              <Route path="/reels" element={<Reels />} />
              {/* <Route path="/blog" element={<Blog />} /> */}
              {/* <Route path="/test" element={<TEST />} />
              <Route path="/test2" element={<TEST2 />} /> */}
              <Route path="/contact" element={<Contact />} />
              <Route path="/blog/:slug" element={<BlogDetail />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
        <Footer />
      </Router>
    </MenuDrawerProvider>
  );
}

// MenuDrawerの状態管理用コンテナ
import { useMenuDrawer } from "./components/MenuDrawerContext";
const MenuDrawerContainer = () => {
  const { open, closeMenu } = useMenuDrawer();
  return (
    <MenuDrawer open={open} onClose={closeMenu}>
      {/* メニュー項目をここに追加 */}
      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        <li style={{ marginBottom: 24 }}>
          <a href="/" className="text-xl text-[#222] no-underline">
            Home
          </a>
        </li>
        <li style={{ marginBottom: 24 }}>
          <a href="/sunaba" className="text-xl text-[#222] no-underline">
            Sunaba
          </a>
        </li>
        {/* 必要に応じて追加 */}
      </ul>
    </MenuDrawer>
  );
};

export default App;
