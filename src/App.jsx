import { useEffect } from "react";
import { animate, set, stagger } from "animejs";
import "./App.css";

const animationItems = [
  { id: "anim-01", label: "01 Fade In" },
  { id: "anim-02", label: "02 Slide Up" },
  { id: "anim-03", label: "03 Pop Scale" },
  { id: "anim-04", label: "04 Letter Stagger" },
  { id: "anim-05", label: "05 Rotate In" },
  { id: "anim-06", label: "06 Wave Loop" },
  { id: "anim-07", label: "07 Pulse Loop" },
  { id: "anim-08", label: "08 Color Shift" },
  { id: "anim-09", label: "09 Tracking In" },
  { id: "anim-10", label: "10 Scroll Linked" },
];

function App() {
  useEffect(() => {
    animate({
      targets: ".anim-01",
      opacity: [0, 1],
      duration: 800,
      easing: "easeOutQuad",
    });

    animate({
      targets: ".anim-02",
      translateY: [30, 0],
      opacity: [0, 1],
      duration: 900,
      easing: "easeOutExpo",
    });

    animate({
      targets: ".anim-03",
      scale: [0.75, 1],
      opacity: [0, 1],
      duration: 900,
      easing: "easeOutBack",
    });

    animate({
      targets: ".anim-04 span",
      opacity: [0, 1],
      translateY: [20, 0],
      delay: stagger(50),
      easing: "easeOutSine",
      duration: 700,
    });

    animate({
      targets: ".anim-05",
      rotate: [-10, 0],
      opacity: [0, 1],
      duration: 900,
      easing: "easeOutCubic",
    });

    animate({
      targets: ".anim-06",
      translateX: [0, 8, 0, -8, 0],
      loop: true,
      duration: 1800,
      easing: "easeInOutSine",
    });

    animate({
      targets: ".anim-07",
      scale: [1, 1.05, 1],
      loop: true,
      duration: 1400,
      easing: "easeInOutQuad",
    });

    animate({
      targets: ".anim-08",
      color: ["#0f172a", "#2563eb", "#0f172a"],
      loop: true,
      duration: 2200,
      easing: "linear",
    });

    animate({
      targets: ".anim-09",
      letterSpacing: ["0em", "0.25em", "0.05em"],
      opacity: [0, 1],
      duration: 1300,
      easing: "easeOutQuart",
    });

    const handleScroll = () => {
      const max = document.body.scrollHeight - window.innerHeight;
      const progress = max > 0 ? window.scrollY / max : 0;
      set(".anim-10-bar", {
        scaleX: Math.min(Math.max(progress, 0), 1),
      });
      set(".anim-10", {
        translateX: progress * 120,
      });
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <main className="container">
      <h1>Vite + React + animejs (Simple 10 Samples)</h1>
      <p className="sub">
        9つのテキストアニメーション + 1つのスクロール連動アニメーション
      </p>
      <div className="grid">
        {animationItems.map((item) => (
          <section key={item.id} className={`card ${item.id}`}>
            {item.id === "anim-04" ? (
              <h2 className="anim-04">
                {"Letter Stagger".split("").map((ch, index) => (
                  <span key={`${ch}-${index}`}>{ch === " " ? "\u00A0" : ch}</span>
                ))}
              </h2>
            ) : item.id === "anim-10" ? (
              <>
                <h2>{item.label}</h2>
                <div className="anim-10-track">
                  <div className="anim-10-bar" />
                </div>
                <p className="scroll-note">スクロールでバーとテキストが進みます。</p>
              </>
            ) : (
              <h2>{item.label}</h2>
            )}
          </section>
        ))}
      </div>
      <div className="spacer" />
    </main>
  );
}

export default App;
