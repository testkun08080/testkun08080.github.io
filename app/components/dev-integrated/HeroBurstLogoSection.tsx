import { useEffect, useRef, useState, type MutableRefObject } from "react";
import { animate, onScroll } from "animejs";
import {
  FlowMode,
  HeroLogoInkWebGL,
} from "../../components/portfolio/HeroLogoInkWebGL";
import { PathBarcodeTemplate3D } from "../../components/portfolio/PathBarcodeTemplate3D";
import { usePrefersReducedMotion } from "../../lib/usePrefersReducedMotion";
import { P_HERO_CURTAIN_CLOSE_END } from "./bridgeScrollPhases";
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

// Fewer characters on mobile to reduce DOM node count (209 → 95)
const TEXT_REPEAT_DESKTOP = 11;
const TEXT_REPEAT_MOBILE = 8;

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

export type HeroBurstLogoSectionProps = {
  onReady?: () => void;
  /**
   * Full bridge scroll progress in [0, 1]. When set, barcode zoom-out / logo fade
   * follow `clamp(p / P_HERO_CURTAIN_CLOSE_END)` so they match hero fade and curtain close.
   */
  bridgeScrollProgressRef?: MutableRefObject<number>;
};

export function HeroBurstLogoSection({
  onReady,
  bridgeScrollProgressRef,
}: HeroBurstLogoSectionProps) {
  const reduceMotion = usePrefersReducedMotion();
  const [scrollLogoBoost, setScrollLogoBoost] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const stageRef = useRef<HTMLElement>(null);
  const barcodeFrameRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);

  // Detect mobile once on mount
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    setIsMobile(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

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

    const clamp01 = (v: number) => Math.min(Math.max(v, 0), 1);
    const p1 = P_HERO_CURTAIN_CLOSE_END;
    const applyProgress = (progress: number) => {
      const progressed = clamp01(progress);
      const scale = 1 + progressed * 0.9;
      const opacity = 1 - progressed;
      barcodeFrame.style.transform = `scale(${scale})`;
      barcodeFrame.style.opacity = String(opacity);
      if (Math.abs(progressed - progressRef.current) < 0.01) return;
      progressRef.current = progressed;
      setScrollLogoBoost(progressed * 0.16);
      setScrollProgress(progressed);
    };

    const syncFromBridge = bridgeScrollProgressRef
      ? animate(stage, {
          opacity: [1, 1],
          duration: 1,
          ease: "linear",
          autoplay: onScroll({
            // target: stage,
            // container: window,
            // enter: "top top",
            // leave: "bottom bottom",
            sync: true,
            onUpdate: () => {
              applyProgress(clamp01(bridgeScrollProgressRef.current / p1));
            },
          }),
        })
      : animate(stage, {
          opacity: [1, 1],
          duration: 1,
          ease: "linear",
          autoplay: onScroll({
            // target: stage,
            // container: window,
            // enter: "top top",
            // leave: "bottom bottom",
            sync: true,
            onUpdate: (self) => {
              const observer = self as { progress?: number };
              if (typeof observer.progress !== "number") return;
              applyProgress(observer.progress);
            },
          }),
        });

    return () => {
      syncFromBridge.revert();
      progressRef.current = 0;
      setScrollLogoBoost(0);
      setScrollProgress(0);
    };
  }, [reduceMotion, bridgeScrollProgressRef]);

  const fs = HERO_BARCODE.fontSize;
  const shaderInkScale = lerp(4.0, 4.0 * 2.8, scrollProgress);
  const shaderWarpScale = lerp(2.0, 2.0 * 2.2, scrollProgress);
  const shaderOpacity = reduceMotion ? 1 : lerp(1, 0, scrollProgress);
  const textRepeat = isMobile ? TEXT_REPEAT_MOBILE : TEXT_REPEAT_DESKTOP;

  return (
    <section ref={stageRef} className={styles.stage}>
      <div className={styles.stickyViewport}>
        <HeroLogoInkWebGL
          className={styles.logoLayer}
          paused={reduceMotion}
          flowMode={"radial" as FlowMode}
          logoSize={0.2 + scrollLogoBoost}
          mouseEnabled={!reduceMotion}
          inkScale={shaderInkScale}
          warpScale={shaderWarpScale}
          style={{ opacity: shaderOpacity }}
          onReady={onReady}
        />

        <div ref={barcodeFrameRef} className={styles.barcodeFrame}>
          <PathBarcodeTemplate3D
            paused={reduceMotion}
            className={styles.barcodeTheme}
            flowDurationMs={33000}
            textUnit="*0123456789ABCDEF* "
            textRepeat={textRepeat}
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
