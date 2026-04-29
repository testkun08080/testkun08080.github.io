import { animate, createScope, onScroll, stagger } from "animejs";
import { useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";
import styles from "./DevHogehoge.module.css";

const REEL_VIDEOS = [
  {
    label: "Reel 01",
    title: "reel 2022–2024",
    embedUrl: "https://www.youtube.com/embed/pMOKLQ0rxhU?rel=0",
  },
  {
    label: "Reel 02",
    title: "reel 2017–2022",
    embedUrl: "https://www.youtube.com/embed/L2ci7xq4EEk?rel=0",
    desc: "CAPCOM時代のシェーダー・ルックデヴ・パイプライン構築を中心としたリール。",
  },
] as const;

const MARQUEE =
  "SHADER • LOOKDEV • PIPELINE • UNITY • MAYA • HOUDINI • HLSL • TEAM SUPPORT • OPTIMIZATION • ";

const BG_KEYWORDS = [
  "SHADER LOOKDEV PIPELINE SHADER LOOKDEV PIPELINE",
  "UNITY MAYA HOUDINI BLENDER UNITY MAYA HOUDINI",
  "OPTIMIZATION TOOLING PRODUCTION SUPPORT",
  "TECHNICAL ARTIST CREATIVE ENGINEERING",
  "SHADER LOOKDEV PIPELINE SHADER LOOKDEV PIPELINE",
  "UNITY MAYA HOUDINI BLENDER UNITY MAYA HOUDINI",
  "OPTIMIZATION TOOLING PRODUCTION SUPPORT",
];

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
  const reduceMotion = useReducedMotion() ?? false;
  const rootRef = useRef<HTMLElement>(null);
  const scopeRef = useRef<ReturnType<typeof createScope> | null>(null);

  const heroContentRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLElement>(null);
  const reel1TrackRef = useRef<HTMLElement>(null);
  const reel2Ref = useRef<HTMLElement>(null);
  const outroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reduceMotion || !rootRef.current) return;

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
        translateY: ["-20px", "20px"],
        translateX: ["-10px", "10px"],
        scale: [0.94, 1.06],
        duration: 4000,
        loop: true,
        alternate: true,
        delay: stagger(400),
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
      animate(`.${styles.videoFrame}`, {
        scale: [0.82, 1],
        opacity: [0, 1],
        ease: "linear",
        autoplay: onScroll({
          target: reel1TrackRef.current!,
          enter: "top top",
          leave: "bottom bottom",
          sync: true,
        }),
      });

      animate(`.${styles.reel1Title}`, {
        letterSpacing: ["0em", "0.18em"],
        opacity: [0.3, 1],
        ease: "linear",
        autoplay: onScroll({
          target: reel1TrackRef.current!,
          enter: "top top",
          leave: "bottom bottom",
          sync: true,
        }),
      });

      animate(`.${styles.reel1BgRow}`, {
        x: (_el: Element, i: number) => (i % 2 === 0 ? "-14vw" : "14vw"),
        opacity: [0.04, 0.25],
        ease: "linear",
        autoplay: onScroll({
          target: reel1TrackRef.current!,
          enter: "top top",
          leave: "bottom bottom",
          sync: true,
        }),
      });

      animate(`.${styles.reel1Glow}`, {
        scale: [0.5, 1.3],
        opacity: [0.15, 0.5],
        ease: "linear",
        autoplay: onScroll({
          target: reel1TrackRef.current!,
          enter: "top top",
          leave: "bottom bottom",
          sync: true,
        }),
      });

      // ── Reel 02: slide-in ──
      animate(`.${styles.reel2Left}`, {
        translateX: ["-20vw", "0"],
        opacity: [0, 1],
        ease: "linear",
        autoplay: onScroll({
          target: reel2Ref.current!,
          enter: "top bottom",
          leave: "bottom top",
          sync: true,
        }),
      });

      animate(`.${styles.reel2Right}`, {
        translateX: ["20vw", "0"],
        opacity: [0, 1],
        rotate: ["2deg", "0deg"],
        ease: "linear",
        autoplay: onScroll({
          target: reel2Ref.current!,
          enter: "top bottom",
          leave: "bottom top",
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
  }, [reduceMotion]);

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
          <div className={styles.reel1BgLayer}>
            {BG_KEYWORDS.map((text, i) => (
              <div key={i} className={styles.reel1BgRow}>
                {text}
              </div>
            ))}
          </div>

          <div
            className={styles.reel1Glow}
            style={{
              width: 400,
              height: 400,
              top: "20%",
              left: "10%",
              background: "rgba(56,189,248,0.12)",
            }}
          />
          <div
            className={styles.reel1Glow}
            style={{
              width: 350,
              height: 350,
              bottom: "15%",
              right: "8%",
              background: "rgba(239,68,68,0.10)",
            }}
          />

          <p className={styles.reel1Label}>{REEL_VIDEOS[0].label}</p>
          <h2 className={styles.reel1Title}>{REEL_VIDEOS[0].title}</h2>
          <div className={styles.videoFrame}>
            <iframe
              src={REEL_VIDEOS[0].embedUrl}
              title={REEL_VIDEOS[0].title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      </section>

      {/* ── Reel 02: Slide-in ── */}
      <section ref={reel2Ref} className={styles.reel2Section}>
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
