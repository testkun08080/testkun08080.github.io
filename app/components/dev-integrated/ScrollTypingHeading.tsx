import { animate, createScope, onScroll } from "animejs";
import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "../../lib/usePrefersReducedMotion";
import styles from "./ScrollTypingHeading.module.css";

type ScrollTypingHeadingProps = {
  text: string;
  enter?: string;
  leave?: string;
  headingClassName?: string;
  underlineClassName?: string;
};

export function ScrollTypingHeading({
  text,
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
    if (!root || !word || !line) return;

    if (reduceMotion) {
      word.textContent = text;
      line.style.transform = "scaleX(1)";
      return;
    }

    word.textContent = "";
    typedCountRef.current = -1;

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
      typedCountRef.current = -1;
    };
  }, [text, enter, leave, reduceMotion]);

  return (
    <div ref={rootRef} className={styles.heading}>
      <h2 ref={wordRef} className={headingClassName ?? styles.word}>
        {reduceMotion ? text : ""}
      </h2>
      <div ref={lineRef} className={underlineClassName ?? styles.underline} />
    </div>
  );
}
