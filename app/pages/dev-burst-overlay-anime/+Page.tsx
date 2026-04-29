import { animate, createScope, onScroll } from "animejs";
import { useEffect, useRef, useState } from "react";
import styles from "./DevBurstOverlayAnime.module.css";

const FRONT_WORD = "konchiwa";
const BG_ROW_TEXT = Array.from({ length: 18 })
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
  const wordRef = useRef<HTMLHeadingElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const typedCountRef = useRef(-1);

  useEffect(() => {
    if (!rootRef.current) return;

    const triggerEl = triggerRef.current;
    const wordEl = wordRef.current;
    const lineEl = lineRef.current;

    const rows = bgRowsRef.current.filter(Boolean) as HTMLParagraphElement[];
    if (!triggerEl || !wordEl || !lineEl || rows.length === 0) return;

    if (reduceMotion) {
      wordEl.textContent = FRONT_WORD;
      lineEl.style.transform = "scaleX(1)";
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

      animate(lineEl, {
        scaleX: [0, 1],
        autoplay: onScroll({
          enter: "bottom top",
          leave: "center top-=100",
          sync: true,
          // repeat: true,
          // debug: true,
        }),
      });

      animate(wordEl, {
        opacity: [1, 1],
        autoplay: onScroll({
          enter: "bottom top",
          leave: "center bottom",
          sync: true,
          // repeat: true,
          // debug: true,
          onUpdate: (self) => {
            const observer = self as { progress?: number };
            if (typeof observer.progress !== "number") return;
            const clamped = Math.min(Math.max(observer.progress, 0), 1);
            const nextCount = Math.floor(clamped * FRONT_WORD.length);
            if (nextCount === typedCountRef.current) return;
            typedCountRef.current = nextCount;
            wordEl.textContent = FRONT_WORD.slice(0, nextCount);
          },
        }),
      });
    });

    return () => {
      scopeRef.current?.revert();
      scopeRef.current = null;
      wordEl.textContent = "";
      typedCountRef.current = -1;
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
          {Array.from({ length: 28 }).map((_, i) => (
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
          <h2 ref={wordRef} className={styles.word}>
            {reduceMotion ? FRONT_WORD : ""}
          </h2>
          <div ref={lineRef} className={styles.underline} />
        </div>
      </section>
    </main>
  );
}
