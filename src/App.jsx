import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { useEffect, useState } from "react";
import "./App.css";
import UnderMaintenance from "./pages/UnderMaintenance";
import UnderMaintenance_post from "./pages/UnderMaintenance_bulge_example";
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

import { useMouseCSSVar } from "./hooks/useMouseCSSVar";
import { useClickEffects } from "./hooks/useClickRipple";

function App() {
  //  マウスCSSエフェクト
  useMouseCSSVar();
  useClickEffects();
  return (
    <MenuDrawerProvider>
      <Router>
        {/* <NoiseCanvas /> */}
        <Header />
        <MenuDrawerContainer />

        <div className="flex flex-col justify-center min-h-screen noise-effect">
          <main className="">
            <AnimatedRoutes />
          </main>
        </div>
        <Footer />
      </Router>
    </MenuDrawerProvider>
  );
}

// MenuDrawerの状態管理用コンテナ
import { useMenuDrawer } from "./components/MenuDrawerContext";
import { Link } from "react-router-dom";

const MenuDrawerContainer = () => {
  const { open, closeMenu } = useMenuDrawer();
  return (
    <MenuDrawer open={open} onClose={closeMenu}>
      {/* メニュー項目をここに追加 */}
      <ul className="list-none p-0 m-0">
        <li className="mb-6">
          <Link
            to="/"
            className="text-xl text-[#222] no-underline"
            onClick={closeMenu}
          >
            Home
          </Link>
        </li>
        <li className="mb-6">
          <Link
            to="/sunaba"
            className="text-xl text-[#222] no-underline"
            onClick={closeMenu}
          >
            Sunaba
          </Link>
        </li>
        {/* 必要に応じて追加 */}
      </ul>
    </MenuDrawer>
  );
};

// ページ遷移アニメーション用コンポーネント
function AnimatedRoutes() {
  const location = useLocation();
  const [displayLocation, setDisplayLocation] = useState(location);
  const [fadeClass, setFadeClass] = useState("fade-in");

  useEffect(() => {
    // ページが変わったらまず fade-out
    setFadeClass("fade-out");

    const timeout = setTimeout(() => {
      // 画面を新しい location に切り替え
      setDisplayLocation(location);
      // fade-in
      setFadeClass("fade-in");
    }, 300); // fade-outの時間に合わせる

    return () => clearTimeout(timeout);
  }, [location]);

  return (
    <div className={`page-wrapper ${fadeClass}`}>
      <Routes location={displayLocation} key={displayLocation.pathname}>
        <Route path="/" element={<UnderMaintenance />} />
        <Route path="/sunaba" element={<Sunaba />} />
        <Route path="/about" element={<About />} />
        <Route path="/reels" element={<Reels />} />
        <Route
          path="/UnderMaintenance_post"
          element={<UnderMaintenance_post />}
        />
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}
export default App;
