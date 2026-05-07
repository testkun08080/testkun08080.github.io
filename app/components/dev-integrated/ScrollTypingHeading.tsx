import { animate, createScope, onScroll } from "animejs";
import { useEffect, useRef, type MutableRefObject } from "react";
import { usePrefersReducedMotion } from "../../lib/usePrefersReducedMotion";
import styles from "./ScrollTypingHeading.module.css";

export type ScrollTypingHeadingProps = {
  text: string;
  enter?: string;
  leave?: string;
  headingClassName?: string;
  underlineClassName?: string;
  /**
   * Bridge / external scroll sync: reads [0–1] each frame via scroll–RAF chain.
   * When set, skips anime.js onScroll linkage for this heading.
   */
  bridgeScrollProgressRef?: MutableRefObject<number>;
  /** Characters begin only once ref value reaches this threshold (defaults below). */
  bridgeTypingRevealStart?: number;
  /** Full typing + underline reveal by this threshold. */
  bridgeTypingRevealEnd?: number;
};

const clamp01 = (v: number) => Math.min(Math.max(v, 0), 1);

function lerpOpacity(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

export function ScrollTypingHeading({
  text,
  enter = "bottom top",
  leave = "center top",
  headingClassName,
  underlineClassName,
  bridgeScrollProgressRef,
  /** Default: curtain mostly open (phase 0.5→1); pass 1 to gate strictly on full bridge progress */
  bridgeTypingRevealStart = 0.1,
  bridgeTypingRevealEnd = 1,
}: ScrollTypingHeadingProps) {
  const reduceMotion = usePrefersReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const wordRef = useRef<HTMLHeadingElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const typedCountRef = useRef(-1);
  const lineScaleRef = useRef<number>(0);
  const wordOpacityRef = useRef<number>(1);
  const scopeRef = useRef<ReturnType<typeof createScope> | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    const word = wordRef.current;
    const line = lineRef.current;
    if (!root || !word || !line) return;

    if (reduceMotion) {
      word.textContent = text;
      line.style.transform = "scaleX(1)";
      word.style.opacity = "1";
      lineScaleRef.current = 1;
      wordOpacityRef.current = 1;
      return;
    }

    word.textContent = "";
    typedCountRef.current = -1;
    lineScaleRef.current = 0;
    wordOpacityRef.current = 0.45;

    if (bridgeScrollProgressRef) {
      const startRaw = bridgeTypingRevealStart;
      const endRaw = bridgeTypingRevealEnd;
      const start = Math.min(startRaw, endRaw);
      const end = Math.max(startRaw, endRaw);
      let rafId = 0;

      const applyFromBridgeProgress = () => {
        const p = bridgeScrollProgressRef.current;
        if (p < start) {
          if (lineScaleRef.current !== 0) {
            lineScaleRef.current = 0;
            line.style.transform = "scaleX(0)";
          }
          if (typedCountRef.current !== -1) {
            word.textContent = "";
          }
          typedCountRef.current = -1;
          if (wordOpacityRef.current !== 0.45) {
            wordOpacityRef.current = 0.45;
            word.style.opacity = "0.45";
          }
          return;
        }

        const span = end - start;
        const sub =
          span <= 1e-6
            ? p >= start
              ? 1
              : 0
            : clamp01((Math.min(p, end) - start) / span);
        if (lineScaleRef.current !== sub) {
          lineScaleRef.current = sub;
          line.style.transform = `scaleX(${sub})`;
        }

        const nextOpacity = lerpOpacity(0.45, 1, sub);
        if (wordOpacityRef.current !== nextOpacity) {
          wordOpacityRef.current = nextOpacity;
          word.style.opacity = String(nextOpacity);
        }

        const nextCount = Math.floor(sub * text.length);
        if (nextCount === typedCountRef.current) return;
        typedCountRef.current = nextCount;
        word.textContent = text.slice(0, nextCount);
      };

      const schedule = () => {
        cancelAnimationFrame(rafId);
        rafId = window.requestAnimationFrame(applyFromBridgeProgress);
      };

      schedule();
      window.addEventListener("scroll", schedule, { passive: true });
      window.addEventListener("resize", schedule, { passive: true });

      return () => {
        window.removeEventListener("scroll", schedule);
        window.removeEventListener("resize", schedule);
        cancelAnimationFrame(rafId);
        word.textContent = text;
        line.style.transform = "scaleX(1)";
        lineScaleRef.current = 1;
        typedCountRef.current = -1;
        word.style.opacity = "";
        wordOpacityRef.current = 1;
      };
    }

    scopeRef.current = createScope({ root }).add(() => {
      animate(line, {
        scaleX: [0, 1],
        autoplay: onScroll({
          enter,
          leave,
          sync: true,
        }),
      });

      animate(word, {
        opacity: [0.45, 1],
        autoplay: onScroll({
          enter,
          leave,
          sync: true,
          onUpdate: (self) => {
            const observer = self as { progress?: number };
            if (typeof observer.progress !== "number") return;
            const clamped = Math.min(Math.max(observer.progress, 0), 1);
            const nextCount = Math.floor(clamped * text.length);
            if (nextCount === typedCountRef.current) return;
            typedCountRef.current = nextCount;
            word.textContent = text.slice(0, nextCount);
          },
        }),
      });
    });

    return () => {
      scopeRef.current?.revert();
      scopeRef.current = null;
      word.textContent = text;
      line.style.transform = "scaleX(1)";
      lineScaleRef.current = 1;
      typedCountRef.current = -1;
      wordOpacityRef.current = 1;
    };
  }, [
    text,
    enter,
    leave,
    reduceMotion,
    bridgeScrollProgressRef,
    bridgeTypingRevealStart,
    bridgeTypingRevealEnd,
  ]);

  return (
    <div ref={rootRef} className={styles.heading}>
      <div className={styles.wordWrap}>
        {/* Invisible spacer: always holds the full-text height so layout never shifts during typing */}
        <h2
          className={headingClassName ?? styles.word}
          aria-hidden="true"
          style={{ visibility: "hidden" }}
        >
          {text}
        </h2>
        <h2
          ref={wordRef}
          className={`${headingClassName ?? styles.word} ${styles.wordOverlay}`}
        >
          {reduceMotion ? text : ""}
        </h2>
      </div>
      <div ref={lineRef} className={underlineClassName ?? styles.underline} />
    </div>
  );
}
