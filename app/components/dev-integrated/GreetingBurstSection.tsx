import { animate, createScope, onScroll } from "animejs";
import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "../../lib/usePrefersReducedMotion";
import { ScrollTypingHeading } from "./ScrollTypingHeading";
import styles from "../shared-dev-assets/DevBurstOverlayAnime.module.css";

const BG_ROW_COUNT = 22;

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
  const bgRowsRef = useRef<(HTMLParagraphElement | null)[]>([]);

  useEffect(() => {
    if (!rootRef.current) return;

    const triggerEl = triggerRef.current;
    const rows = bgRowsRef.current.filter(Boolean) as HTMLParagraphElement[];
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
        animate(row, {
          translateX: [window.innerWidth * 0.45 * direction, 0],
          opacity: [0.15, 0.82],
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
  }, [reduceMotion]);

  return (
    <main ref={rootRef} className={styles.page}>
      <section ref={triggerRef} className={styles.stage}>
        <div className={styles.bgLayer}>
          {Array.from({ length: BG_ROW_COUNT }).map((_, i) => (
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
