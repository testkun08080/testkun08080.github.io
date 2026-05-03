import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "../../lib/usePrefersReducedMotion";
import { GreetingBurstSection } from "./GreetingBurstSection";
import { HeroBurstLogoSection } from "./HeroBurstLogoSection";
import styles from "./HeroGreetingNarrative.module.css";

const ROW_COUNT = 14;
const ROW_TEXT_REPEAT = 12;

/**
 * Phase mapping (wrapper scroll progress p, where 0 = top, 1 = end of greeting sticky):
 * - p < BRIDGE_START: rows hidden (hero is doing its own visuals)
 * - BRIDGE_START → BRIDGE_END: rows slide in from sides + cream bg fades in (same as old bridge)
 * - BRIDGE_END → 1.0: rows fully visible across hero→greeting seam, gentle opacity pulse
 *
 * For default heights (hero 220dvh + greeting 180dvh, viewport 100dvh):
 *   total scroll = 300dvh; hero progress 0.66 ≈ wrapper p 0.264; hero progress 0.92 ≈ wrapper p 0.367.
 */
const BRIDGE_START = 0.26;
const BRIDGE_END = 0.38;

type Props = {
  onHeroReady?: () => void;
  greetingFrontWord: string;
  greetingBgRowText: string;
};

export function HeroGreetingNarrative({
  onHeroReady,
  greetingFrontWord,
  greetingBgRowText,
}: Props) {
  const reduceMotion = usePrefersReducedMotion();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const layerRef = useRef<HTMLDivElement>(null);
  const rowsRef = useRef<HTMLParagraphElement[]>([]);
  const lastLayerOpRef = useRef(-1);
  const lastSlideRef = useRef(-1);
  const lastRowOpRef = useRef(-1);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const layer = layerRef.current;
    if (!wrapper || !layer) return;

    if (reduceMotion) {
      layer.style.opacity = "1";
      const rows = rowsRef.current;
      for (let i = 0; i < rows.length; i++) {
        if (rows[i]) {
          rows[i].style.transform = "translateX(0vw)";
          rows[i].style.opacity = "0.82";
        }
      }
      return;
    }

    let rafId = 0;
    const clamp01 = (v: number) => Math.min(Math.max(v, 0), 1);

    const update = () => {
      const rect = wrapper.getBoundingClientRect();
      const total = Math.max(rect.height - window.innerHeight, 1);
      const p = clamp01(-rect.top / total);

      let layerOp: number;
      let slide: number; // 1 = rows fully offscreen at sides, 0 = settled
      let rowOp: number;

      if (p < BRIDGE_START) {
        layerOp = 0;
        slide = 1;
        rowOp = 0;
      } else if (p < BRIDGE_END) {
        const bp = (p - BRIDGE_START) / (BRIDGE_END - BRIDGE_START);
        layerOp = bp;
        slide = 1 - bp;
        rowOp = bp * 0.84;
      } else {
        layerOp = 1;
        slide = 0;
        // Gentle pulse from 0.7 → 0.86 across the rest of the wrapper
        const tail = (p - BRIDGE_END) / (1 - BRIDGE_END);
        rowOp = 0.7 + tail * 0.16;
      }

      // Skip writes when nothing changed meaningfully
      if (Math.abs(layerOp - lastLayerOpRef.current) >= 0.005) {
        lastLayerOpRef.current = layerOp;
        layer.style.opacity = String(layerOp);
      }

      const slideChanged = Math.abs(slide - lastSlideRef.current) >= 0.005;
      const opChanged = Math.abs(rowOp - lastRowOpRef.current) >= 0.005;
      if (slideChanged || opChanged) {
        lastSlideRef.current = slide;
        lastRowOpRef.current = rowOp;
        const rows = rowsRef.current;
        for (let i = 0; i < rows.length; i++) {
          const row = rows[i];
          if (!row) continue;
          if (slideChanged) {
            const dir = i % 2 === 0 ? -1 : 1;
            row.style.transform = `translateX(${dir * slide * 52}vw)`;
          }
          if (opChanged) {
            row.style.opacity = String(rowOp);
          }
        }
      }
    };

    const onScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = window.requestAnimationFrame(update);
    };
    const onResize = onScroll;

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      lastLayerOpRef.current = -1;
      lastSlideRef.current = -1;
      lastRowOpRef.current = -1;
    };
  }, [reduceMotion]);

  return (
    <div ref={wrapperRef} className={styles.wrapper}>
      {/* Shared rows layer pinned across both Hero and Greeting */}
      <div ref={layerRef} className={styles.rowsLayer} aria-hidden>
        <div className={styles.rowsBg} />
        {Array.from({ length: ROW_COUNT }).map((_, i) => (
          <p
            key={i}
            ref={(el) => {
              if (el) rowsRef.current[i] = el;
            }}
            className={styles.row}
          >
            {Array.from({ length: ROW_TEXT_REPEAT })
              .map(() => greetingBgRowText)
              .join(" ")}
          </p>
        ))}
      </div>

      <section id="hero" className={styles.heroSection}>
        <HeroBurstLogoSection onReady={onHeroReady} />
      </section>

      <section id="greeting" className={styles.greetingSection}>
        <GreetingBurstSection frontWord={greetingFrontWord} />
      </section>
    </div>
  );
}
