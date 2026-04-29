import { animate, createScope, onScroll, stagger } from "animejs";
import { useEffect, useRef } from "react";
import styles from "./DevHogehoge.module.css";

const REEL_VIDEOS = [
  {
    label: "Reel 01",
    title: "reel 2022–2024",
    embedUrl: "https://www.youtube.com/embed/pMOKLQ0rxhU?rel=0&playsinline=1",
    desc: "リール。",
  },
  {
    label: "Reel 02",
    title: "reel 2017–2022",
    embedUrl: "https://www.youtube.com/embed/L2ci7xq4EEk?rel=0&playsinline=1",
    desc: "CAPCOM時代のシェーダー・ルックデヴ・パイプライン構築を中心としたリール。",
  },
] as const;

const MARQUEE =
  "SHADER • LOOKDEV • PIPELINE • UNITY • MAYA • HOUDINI • HLSL • TEAM SUPPORT • OPTIMIZATION • ";

const ART_ORBS = [
  { size: 280, top: "12%", left: "8%", color: "rgba(239,68,68,0.12)" },
  { size: 220, top: "30%", left: "75%", color: "rgba(56,189,248,0.10)" },
  { size: 180, top: "65%", left: "20%", color: "rgba(191,219,254,0.08)" },
];

const INTRO_LINES = [
  "7+ years of Technical Art.",
  "Shaders, Pipelines, LookDev.",
  "Building bridges between art and engineering.",
];

export default function Page() {
  const rootRef = useRef<HTMLElement>(null);
  const scopeRef = useRef<ReturnType<typeof createScope> | null>(null);

  const heroContentRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLElement>(null);
  const reel1TrackRef = useRef<HTMLElement>(null);
  const reel2TrackRef = useRef<HTMLElement>(null);
  const outroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!rootRef.current) return;

    scopeRef.current = createScope({ root: rootRef.current }).add(() => {
      // ── Hero entrance ──
      animate(heroContentRef.current!, {
        opacity: [0, 1],
        translateY: [40, 0],
        scale: [0.95, 1],
        duration: 1200,
        ease: "out(3)",
      });

      // ── Floating orbs ──
      animate(`.${styles.heroOrb}`, {
        translateY: ["-12px", "12px"],
        translateX: ["-6px", "6px"],
        scale: [0.97, 1.03],
        duration: 5200,
        loop: true,
        alternate: true,
        delay: stagger(520),
        ease: "inOut(2)",
      });

      // ── Marquee ──
      animate(`.${styles.marqueeText}`, {
        translateX: ["0%", "-50%"],
        duration: 28000,
        ease: "linear",
        loop: true,
      });

      // ── Intro text reveal ──
      animate(`.${styles.introLine}`, {
        opacity: [0, 1],
        translateY: [30, 0],
        delay: stagger(120),
        ease: "linear",
        autoplay: onScroll({
          target: introRef.current!,
          enter: "top bottom",
          leave: "bottom top",
          sync: true,
        }),
      });

      animate(`.${styles.introRule}`, {
        scaleX: [0, 1],
        opacity: [0.2, 0.8],
        ease: "linear",
        autoplay: onScroll({
          target: introRef.current!,
          enter: "top bottom",
          leave: "bottom top",
          sync: true,
        }),
      });

      // ── Reel 01: sticky scroll ──
      animate(`.${styles.reel1Left}`, {
        translateX: ["-10vw", "0"],
        opacity: [0.4, 1],
        ease: "linear",
        autoplay: onScroll({
          target: reel1TrackRef.current!,
          enter: "top bottom",
          leave: "bottom top",
          sync: true,
        }),
      });

      animate(`.${styles.reel1Right}`, {
        translateX: ["10vw", "0"],
        translateY: ["20px", "0px"],
        opacity: [0.35, 1],
        ease: "linear",
        autoplay: onScroll({
          target: reel1TrackRef.current!,
          enter: "top bottom",
          leave: "bottom top",
          sync: true,
        }),
      });

      animate(`.${styles.videoFrame}`, {
        scale: [0.9, 1],
        opacity: [0.5, 1],
        ease: "linear",
        autoplay: onScroll({
          target: reel1TrackRef.current!,
          enter: "top bottom",
          leave: "bottom top",
          sync: true,
        }),
      });

      animate(`.${styles.reel1Title}`, {
        letterSpacing: ["0.02em", "0.1em"],
        opacity: [0.65, 1],
        ease: "linear",
        autoplay: onScroll({
          target: reel1TrackRef.current!,
          enter: "top bottom",
          leave: "bottom top",
          sync: true,
        }),
      });

      // ── Reel 02: sticky scroll ──
      animate(`.${styles.reel2Left}`, {
        translateX: ["-8vw", "0"],
        translateY: ["18px", "0px"],
        opacity: [0.2, 1],
        ease: "linear",
        autoplay: onScroll({
          target: reel2TrackRef.current!,
          enter: "top center",
          leave: "center center",
          sync: true,
        }),
      });

      animate(`.${styles.reel2Right}`, {
        translateX: ["8vw", "0"],
        translateY: ["18px", "0px"],
        opacity: [0.2, 1],
        rotate: ["2deg", "0deg"],
        ease: "linear",
        autoplay: onScroll({
          target: reel2TrackRef.current!,
          enter: "top center",
          leave: "center center",
          sync: true,
        }),
      });

      animate(`.${styles.videoFrame2}`, {
        scale: [0.9, 1],
        opacity: [0.4, 1],
        ease: "linear",
        autoplay: onScroll({
          target: reel2TrackRef.current!,
          enter: "top center",
          leave: "center center",
          sync: true,
        }),
      });

      // ── Outro ──
      animate(`.${styles.outroContent}`, {
        opacity: [0, 1],
        translateY: [24, 0],
        duration: 700,
        ease: "out(3)",
        autoplay: onScroll({
          target: outroRef.current!,
          enter: "bottom-=80 top",
          leave: "top bottom",
        }),
      });
    });

    return () => {
      scopeRef.current?.revert();
      scopeRef.current = null;
    };
  }, []);

  return (
    <main ref={rootRef} className={styles.page}>
      {/* ── Hero ── */}
      <section className={styles.hero}>
        {ART_ORBS.map((orb, i) => (
          <div
            key={i}
            className={styles.heroOrb}
            style={{
              width: orb.size,
              height: orb.size,
              top: orb.top,
              left: orb.left,
              background: orb.color,
            }}
          />
        ))}

        <div ref={heroContentRef} style={{ textAlign: "center", zIndex: 1 }}>
          <p className={styles.heroLabel}>Showreel</p>
          <h1 className={styles.heroTitle}>TESTKUN08080</h1>
          <p className={styles.heroSub}>Technical Artist</p>
        </div>

        <div className={styles.marqueeWrap}>
          <span className={styles.marqueeText}>
            {MARQUEE}
            {MARQUEE}
          </span>
        </div>
      </section>

      {/* ── Intro ── */}
      <section ref={introRef} className={styles.intro}>
        {INTRO_LINES.map((line, i) => (
          <p key={i} className={styles.introLine}>
            {line}
          </p>
        ))}
        <div className={styles.introRule} />
      </section>

      {/* ── Reel 01: Sticky Scroll ── */}
      <section ref={reel1TrackRef} className={styles.reel1Track}>
        <div className={styles.reel1Sticky}>
          <div className={styles.reel1Grid}>
            <div className={styles.reel1Left}>
              <p className={styles.reel1Label}>{REEL_VIDEOS[0].label}</p>
              <h2 className={styles.reel1Title}>{REEL_VIDEOS[0].title}</h2>
            </div>
            <div className={styles.reel1Right}>
              <div className={styles.videoFrame}>
                <iframe
                  src={REEL_VIDEOS[0].embedUrl}
                  title={REEL_VIDEOS[0].title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Reel 02: Sticky Scroll ── */}
      <section ref={reel2TrackRef} className={styles.reel2Track}>
        <div className={styles.reel2Sticky}>
          <div className={styles.reel2Grid}>
            <div className={styles.reel2Left}>
              <p className={styles.reel2Label}>{REEL_VIDEOS[1].label}</p>
              <h2 className={styles.reel2Title}>{REEL_VIDEOS[1].title}</h2>
              <p className={styles.reel2Desc}>{REEL_VIDEOS[1].desc}</p>
            </div>
            <div className={styles.reel2Right}>
              <div className={styles.videoFrame2}>
                <iframe
                  src={REEL_VIDEOS[1].embedUrl}
                  title={REEL_VIDEOS[1].title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Outro ── */}
      <section className={styles.outro} ref={outroRef}>
        <div className={styles.outroContent}>
          <h2 className={styles.outroTitle}>More work coming soon.</h2>
          <div className={styles.outroLinks}>
            <a href="/dev-test-portfolio" className={styles.outroLink}>
              Portfolio
            </a>
            <a href="/dev" className={styles.outroLink}>
              Dev Index
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
