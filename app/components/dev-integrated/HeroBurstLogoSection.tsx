import { useEffect, useRef, useState } from "react";
import {
  FlowMode,
  HeroLogoInkWebGL,
} from "../../components/portfolio/HeroLogoInkWebGL";
import { PathBarcodeTemplate3D } from "../../components/portfolio/PathBarcodeTemplate3D";
import styles from "../shared-dev-assets/DevBurstOverlayAnimeLogo.module.css";

const HERO_BARCODE = {
  fontSize: {
    min: "0.5rem",
    preferred: "1.5vw",
    max: "1.23rem",
  },
  letterSpacing: "0.02em",
  fill: "var(--color-anime-barcode)",
} as const;

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !("matchMedia" in window)) return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  return reduced;
}

export function HeroBurstLogoSection() {
  const reduceMotion = usePrefersReducedMotion();
  const [scrollLogoBoost, setScrollLogoBoost] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const stageRef = useRef<HTMLElement>(null);
  const barcodeFrameRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!stageRef.current || !barcodeFrameRef.current) return;

    const stage = stageRef.current;
    const barcodeFrame = barcodeFrameRef.current;

    if (reduceMotion) {
      barcodeFrame.style.opacity = "1";
      barcodeFrame.style.transform = "scale(1)";
      setScrollLogoBoost(0);
      setScrollProgress(0);
      return;
    }

    let rafId = 0;
    const clamp01 = (v: number) => Math.min(Math.max(v, 0), 1);
    const updateByScroll = () => {
      const rect = stage.getBoundingClientRect();
      const scrollable = Math.max(rect.height - window.innerHeight, 1);
      const progressed = clamp01(-rect.top / scrollable);
      const scale = 1 + progressed * 0.9;
      const opacity = 1 - progressed;
      barcodeFrame.style.transform = `scale(${scale})`;
      barcodeFrame.style.opacity = String(opacity);
      setScrollLogoBoost(progressed * 0.16);
      setScrollProgress(progressed);
    };
    const onScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = window.requestAnimationFrame(updateByScroll);
    };
    updateByScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      setScrollLogoBoost(0);
      setScrollProgress(0);
    };
  }, [reduceMotion]);

  const fs = HERO_BARCODE.fontSize;
  const shaderInkScale = lerp(4.0, 4.0 * 2.8, scrollProgress);
  const shaderWarpScale = lerp(2.0, 2.0 * 2.2, scrollProgress);
  const shaderOpacity = reduceMotion ? 1 : lerp(1, 0, scrollProgress);

  return (
    <section ref={stageRef} className={styles.stage}>
      <div className={styles.stickyViewport}>
        <HeroLogoInkWebGL
          className={styles.logoLayer}
          paused={reduceMotion}
          flowMode={"radial" as FlowMode}
          logoSize={0.33 + scrollLogoBoost}
          mouseEnabled={!reduceMotion}
          inkScale={shaderInkScale}
          warpScale={shaderWarpScale}
          style={{ opacity: shaderOpacity }}
        />

        <div ref={barcodeFrameRef} className={styles.barcodeFrame}>
          <PathBarcodeTemplate3D
            paused={reduceMotion}
            className={styles.barcodeTheme}
            flowDurationMs={33000}
            textUnit="*0123456789ABCDEF* "
            textRepeat={11}
            pathD="
              M 8 2
              H 92
              Q 98 2 98 8
              V 92
              Q 98 98 92 98
              H 8
              Q 2 98 2 92
              V 8
              Q 2 2 8 2
              Z
            "
          />
        </div>
      </div>

      <style>{`
        .${styles.barcodeTheme} {
          font-family: "Libre Barcode 39", ui-monospace, monospace;
          font-size: clamp(${fs.min}, ${fs.preferred}, ${fs.max});
          line-height: 1;
          letter-spacing: ${HERO_BARCODE.letterSpacing};
          fill: ${HERO_BARCODE.fill};
        }
      `}</style>
    </section>
  );
}
