import { animate, createScope, onScroll } from "animejs";
import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "../../lib/usePrefersReducedMotion";
import { ScrollTypingHeading } from "./ScrollTypingHeading";
import styles from "../shared-dev-assets/DevBurstOverlayAnime.module.css";

const INITIAL_BG_ROW_COUNT = 14;

type GreetingBurstSectionProps = {
  frontWord?: string;
  bgRowText?: string;
};

export function GreetingBurstSection({
  frontWord = "konchiwa",
  bgRowText = "hi there hello oi",
}: GreetingBurstSectionProps) {
  const reduceMotion = usePrefersReducedMotion();
  const rootRef = useRef<HTMLElement>(null);
  const scopeRef = useRef<ReturnType<typeof createScope> | null>(null);
  const triggerRef = useRef<HTMLElement>(null);
  const bgLayerRef = useRef<HTMLDivElement>(null);
  const measureRowRef = useRef<HTMLParagraphElement>(null);
  const bgRowsRef = useRef<(HTMLParagraphElement | null)[]>([]);
  const [bgRowCount, setBgRowCount] = useState(INITIAL_BG_ROW_COUNT);

  useEffect(() => {
    let rafId = 0;
    const updateBgRowCount = () => {
      if (typeof window === "undefined") return;
      const measuredRow = measureRowRef.current;
      const bgLayer = bgLayerRef.current;
      if (!measuredRow || !bgLayer) return;
      const rowHeight = measuredRow.getBoundingClientRect().height;
      if (rowHeight <= 0) return;
      const layerStyles = window.getComputedStyle(bgLayer);
      const rowGap = Number.parseFloat(layerStyles.rowGap || "0") || 0;
      const rowPitch = rowHeight + rowGap;
      const isMobile = window.matchMedia("(max-width: 640px)").matches;
      const minRows = isMobile ? 10 : 12;
      const maxRows = isMobile ? 16 : 24;
      const buffer = isMobile ? 1 : 2;
      const viewportHeight = window.innerHeight;
      const desired = Math.ceil(viewportHeight / rowPitch) + buffer;
      const nextCount = Math.min(maxRows, Math.max(minRows, desired));
      setBgRowCount((prev) => (prev === nextCount ? prev : nextCount));
    };

    const scheduleUpdate = () => {
      cancelAnimationFrame(rafId);
      rafId = window.requestAnimationFrame(updateBgRowCount);
    };

    scheduleUpdate();
    window.addEventListener("resize", scheduleUpdate);
    window.addEventListener("orientationchange", scheduleUpdate);
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", scheduleUpdate);
      window.removeEventListener("orientationchange", scheduleUpdate);
    };
  }, []);

  useEffect(() => {
    if (!rootRef.current) return;

    const triggerEl = triggerRef.current;
    const rows = bgRowsRef.current.slice(0, bgRowCount).filter(Boolean) as HTMLParagraphElement[];
    if (!triggerEl || rows.length === 0) return;

    if (reduceMotion) {
      rows.forEach((row) => {
        row.style.opacity = "0.9";
        row.style.transform = "translateX(0px)";
      });
      return;
    }

    scopeRef.current = createScope({ root: rootRef.current }).add(() => {
      rows.forEach((row, i) => {
        const direction = i % 2 === 0 ? -1 : 1;
        // Start offset shortened (0.28 vs 0.45) so rows feel like continuation of hero bridge rows
        animate(row, {
          translateX: [window.innerWidth * 0.28 * direction, 0],
          opacity: [0.32, 0.82],
          duration: 1000,
          delay: i * 100,
          ease: "linear",
          autoplay: onScroll({
            enter: "bottom top",
            leave: "top bottom",
            sync: true,
            repeat: true,
          }),
        });
      });
    });

    return () => {
      scopeRef.current?.revert();
      scopeRef.current = null;
    };
  }, [bgRowCount, reduceMotion]);

  return (
    <main ref={rootRef} className={styles.page}>
      <section ref={triggerRef} className={styles.stage}>
        <div ref={bgLayerRef} className={styles.bgLayer}>
          <p ref={measureRowRef} className={`${styles.bgRow} ${styles.measureRow}`} aria-hidden>
            {bgRowText}
          </p>
          {Array.from({ length: bgRowCount }).map((_, i) => (
            <p
              key={`row-${i}`}
              ref={(el) => {
                bgRowsRef.current[i] = el;
              }}
              className={styles.bgRow}
            >
              {Array.from({ length: 15 })
                .map(() => bgRowText)
                .join(" ")}
            </p>
          ))}
        </div>

        {/* Top fade: softens entry from hero bridge */}
        <div className={styles.fadeTop} aria-hidden />
        {/* Bottom fade: rows dissolve into About section */}
        <div className={styles.fadeBottom} aria-hidden />

        <div className={styles.frontLayer}>
          <ScrollTypingHeading
            text={frontWord}
            headingClassName={styles.word}
            underlineClassName={styles.underline}
          />
        </div>
      </section>
    </main>
  );
}
