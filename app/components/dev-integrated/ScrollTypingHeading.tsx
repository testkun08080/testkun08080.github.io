import { animate, createScope, onScroll } from "animejs";
import { useEffect, useRef, type MutableRefObject } from "react";
import { usePrefersReducedMotion } from "../../lib/usePrefersReducedMotion";
import {
  createScrollRunOnceLatch,
  getScrollProgress,
  handleScrollRunOnceUpdate,
} from "../../lib/scrollRunOnce";
import { subscribeWindowRaf } from "../../lib/windowRafDriver";
import styles from "./ScrollTypingHeading.module.css";

export type ScrollTypingHeadingProps = {
  text: string;
  enter?: string;
  leave?: string;
  /** When true (default), heading stays revealed after first full scroll-through. */
  scrollRunOnce?: boolean;
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
  scrollRunOnce = true,
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
      const unsubscribe = subscribeWindowRaf(schedule, {
        scroll: true,
        resize: true,
      });

      return () => {
        unsubscribe();
        cancelAnimationFrame(rafId);
        word.textContent = text;
        line.style.transform = "scaleX(1)";
        lineScaleRef.current = 1;
        typedCountRef.current = -1;
        word.style.opacity = "";
        wordOpacityRef.current = 1;
      };
    }

    const applyFinalScrollState = () => {
      line.style.transform = "scaleX(1)";
      lineScaleRef.current = 1;
      word.style.opacity = "1";
      wordOpacityRef.current = 1;
      word.textContent = text;
      typedCountRef.current = text.length;
    };

    const applyScrollProgress = (progress: number) => {
      const clamped = getScrollProgress({ progress });
      if (lineScaleRef.current !== clamped) {
        lineScaleRef.current = clamped;
        line.style.transform = `scaleX(${clamped})`;
      }

      const nextOpacity = lerpOpacity(0.45, 1, clamped);
      if (wordOpacityRef.current !== nextOpacity) {
        wordOpacityRef.current = nextOpacity;
        word.style.opacity = String(nextOpacity);
      }

      const nextCount = Math.floor(clamped * text.length);
      if (nextCount === typedCountRef.current) return;
      typedCountRef.current = nextCount;
      word.textContent = text.slice(0, nextCount);
    };

    scopeRef.current = createScope({ root }).add(() => {
      const latch = scrollRunOnce ? createScrollRunOnceLatch() : null;
      let lineAnim: ReturnType<typeof animate> | null = null;
      let wordAnim: ReturnType<typeof animate> | null = null;

      const latchIfComplete = (self: unknown) => {
        if (!latch || !lineAnim || !wordAnim) return;
        handleScrollRunOnceUpdate(latch, self, () => {
          lineAnim?.revert();
          wordAnim?.revert();
          lineAnim = null;
          wordAnim = null;
          applyFinalScrollState();
        });
      };

      lineAnim = animate(line, {
        scaleX: [0, 1],
        autoplay: onScroll({
          enter,
          leave,
          sync: true,
          onUpdate: (self) => {
            if (latch?.completed) {
              applyFinalScrollState();
              return;
            }
            latchIfComplete(self);
          },
        }),
      });

      wordAnim = animate(word, {
        opacity: [0.45, 1],
        autoplay: onScroll({
          enter,
          leave,
          sync: true,
          onUpdate: (self) => {
            if (latch?.completed) {
              applyFinalScrollState();
              return;
            }

            if (latch) {
              latchIfComplete(self);
              if (latch.completed) return;
            }

            applyScrollProgress(getScrollProgress(self));
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
    scrollRunOnce,
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
