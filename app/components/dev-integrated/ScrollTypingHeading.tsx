import { animate, createScope, onScroll } from "animejs";
import { useEffect, useRef, useState, type RefObject } from "react";
import styles from "./ScrollTypingHeading.module.css";

type ScrollTypingHeadingProps = {
  text: string;
  targetRef: RefObject<HTMLElement | null>;
  enter?: string;
  leave?: string;
  headingClassName?: string;
  underlineClassName?: string;
};

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

export function ScrollTypingHeading({
  text,
  targetRef,
  enter = "bottom top",
  leave = "center top",
  headingClassName,
  underlineClassName,
}: ScrollTypingHeadingProps) {
  const reduceMotion = usePrefersReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const wordRef = useRef<HTMLHeadingElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const typedCountRef = useRef(-1);
  const scopeRef = useRef<ReturnType<typeof createScope> | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    const word = wordRef.current;
    const line = lineRef.current;
    const target = targetRef.current;
    if (!root || !word || !line || !target) return;

    if (reduceMotion) {
      word.textContent = text;
      line.style.transform = "scaleX(1)";
      return;
    }

    word.textContent = "";
    typedCountRef.current = -1;
    let updatedByScroll = false;
    let fallbackRafId = 0;
    let fallbackAttached = false;

    scopeRef.current = createScope({ root }).add(() => {
      animate(line, {
        scaleX: [0, 1],
        autoplay: onScroll({
          target,
          enter,
          leave,
          sync: true,
        }),
      });

      animate(word, {
        opacity: [1, 1],
        autoplay: onScroll({
          target,
          enter,
          leave,
          sync: true,
          onUpdate: (self) => {
            updatedByScroll = true;
            const observer = self as { progress?: number };
            if (typeof observer.progress !== "number") return;
            const clamped = Math.min(Math.max(observer.progress, 0), 1);
            const nextCount = Math.floor(clamped * text.length);
            if (nextCount === typedCountRef.current) return;
            typedCountRef.current = nextCount;
            word.textContent = text.slice(0, nextCount);
            line.style.transform = `scaleX(${clamped})`;
          },
        }),
      });
    });

    // Fallback for environments where onScroll observer is not initialized.
    const updateFromRect = () => {
      const rect = target.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const raw = (vh - rect.top) / Math.max(rect.height + vh * 0.2, 1);
      const progress = Math.min(Math.max(raw, 0), 1);
      const nextCount = Math.floor(progress * text.length);
      if (nextCount !== typedCountRef.current) {
        typedCountRef.current = nextCount;
        word.textContent = text.slice(0, nextCount);
      }
      line.style.transform = `scaleX(${progress})`;
    };

    const onFallbackScroll = () => {
      cancelAnimationFrame(fallbackRafId);
      fallbackRafId = window.requestAnimationFrame(updateFromRect);
    };

    const fallbackTimer = window.setTimeout(() => {
      if (updatedByScroll) return;
      fallbackAttached = true;
      updateFromRect();
      window.addEventListener("scroll", onFallbackScroll, { passive: true });
      window.addEventListener("resize", onFallbackScroll);
    }, 420);

    return () => {
      window.clearTimeout(fallbackTimer);
      cancelAnimationFrame(fallbackRafId);
      if (fallbackAttached) {
        window.removeEventListener("scroll", onFallbackScroll);
        window.removeEventListener("resize", onFallbackScroll);
      }
      scopeRef.current?.revert();
      scopeRef.current = null;
      word.textContent = text;
      line.style.transform = "scaleX(1)";
      typedCountRef.current = -1;
    };
  }, [text, targetRef, enter, leave, reduceMotion]);

  return (
    <div ref={rootRef} className={styles.heading}>
      <h2 ref={wordRef} className={headingClassName ?? styles.word}>
        {reduceMotion ? text : ""}
      </h2>
      <div ref={lineRef} className={underlineClassName ?? styles.underline} />
    </div>
  );
}
