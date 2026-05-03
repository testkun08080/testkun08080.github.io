import { useEffect, useRef, useState } from "react";
import {
  FlowMode,
  HeroLogoInkWebGL,
} from "../../components/portfolio/HeroLogoInkWebGL";
import { PathBarcodeTemplate3D } from "../../components/portfolio/PathBarcodeTemplate3D";
import { usePrefersReducedMotion } from "../../lib/usePrefersReducedMotion";
import styles from "../shared-dev-assets/DevBurstOverlayAnimeLogo.module.css";

const BRIDGE_ROW_COUNT = 12;
const BRIDGE_ROW_TEXT_REPEAT = 10;

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

export function HeroBurstLogoSection({
  onReady,
  bridgeRowText = "hi there hello oi",
}: {
  onReady?: () => void;
  bridgeRowText?: string;
}) {
  const reduceMotion = usePrefersReducedMotion();
  const [scrollLogoBoost, setScrollLogoBoost] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const stageRef = useRef<HTMLElement>(null);
  const barcodeFrameRef = useRef<HTMLDivElement>(null);
  const bridgeLayerRef = useRef<HTMLDivElement>(null);
  const bridgeRowsRef = useRef<HTMLParagraphElement[]>([]);
  const progressRef = useRef(0);
  const bridgePRef = useRef(-1);

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

      if (Math.abs(progressed - progressRef.current) < 0.01) return;
      progressRef.current = progressed;

      // Bridge: cream bg + rows emerge at end of hero scroll
      const bridgeP = clamp01((progressed - 0.66) / 0.26);
      if (Math.abs(bridgeP - bridgePRef.current) >= 0.005) {
        bridgePRef.current = bridgeP;
        if (bridgeLayerRef.current) {
          bridgeLayerRef.current.style.opacity = String(bridgeP);
        }
        // Skip row transforms when bridge is fully hidden or fully settled
        if (bridgeP > 0 && bridgeP < 1) {
          const rows = bridgeRowsRef.current;
          for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            if (!row) continue;
            const dir = i % 2 === 0 ? -1 : 1;
            const tx = dir * (1 - bridgeP) * 52;
            row.style.transform = `translateX(${tx}vw)`;
          }
        } else if (bridgeP >= 1) {
          const rows = bridgeRowsRef.current;
          for (let i = 0; i < rows.length; i++) {
            if (rows[i]) rows[i].style.transform = "translateX(0vw)";
          }
        }
      }

      setScrollLogoBoost(progressed * 0.16);
      setScrollProgress(progressed);
    };

    let resizeTimer = 0;
    const onScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = window.requestAnimationFrame(updateByScroll);
    };
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(onScroll, 150);
    };

    updateByScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(resizeTimer);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      progressRef.current = 0;
      bridgePRef.current = -1;
      setScrollLogoBoost(0);
      setScrollProgress(0);
    };
  }, [reduceMotion]);

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

        {/* Narrative bridge: cream bg + greeting-style rows emerge as hero ends */}
        <div ref={bridgeLayerRef} className={styles.bridgeLayer} aria-hidden>
          <div className={styles.bridgeBg} />
          {Array.from({ length: BRIDGE_ROW_COUNT }).map((_, i) => (
            <p
              key={i}
              ref={(el) => {
                if (el) bridgeRowsRef.current[i] = el;
              }}
              className={styles.bridgeRow}
            >
              {Array.from({ length: BRIDGE_ROW_TEXT_REPEAT })
                .map(() => bridgeRowText)
                .join(" ")}
            </p>
          ))}
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
