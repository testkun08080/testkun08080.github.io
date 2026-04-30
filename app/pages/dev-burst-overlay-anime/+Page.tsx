import { animate, createScope, onScroll } from "animejs";
import { useEffect, useRef, useState } from "react";
import { ScrollTypingHeading } from "../../components/dev-integrated/ScrollTypingHeading";
import styles from "./DevBurstOverlayAnime.module.css";

const FRONT_WORD = "konchiwa";
const BG_ROW_COUNT = 20;
const BG_ROW_TEXT = Array.from({ length: 15 })
  .map(() => "hi there hello oi")
  .join(" ");

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

export default function Page() {
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
            // debug: true,
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
      <section className={styles.intro}>
        <h1 className={styles.title}>dev-burst-overlay-anime</h1>
        <p className={styles.copy}>
          背景に白文字のバースト、前面に黒文字タイピングを重ねる（animejs）。
        </p>
      </section>

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
              {BG_ROW_TEXT}
            </p>
          ))}
        </div>

        <div className={styles.frontLayer}>
          <ScrollTypingHeading
            text={FRONT_WORD}
            targetRef={triggerRef}
            enter="bottom top"
            leave="center top-=100"
            headingClassName={styles.word}
            underlineClassName={styles.underline}
          />
        </div>
      </section>
    </main>
  );
}
