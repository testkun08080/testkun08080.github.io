import { useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";
import styles from "./DevBurstOverlay.module.css";

const FRONT_WORD = "konchiwa";
const BG_ROW_TEXT = Array.from({ length: 18 })
  .map(() => "hi there hello oi")
  .join(" ");

function clamp01(v: number) {
  return Math.max(0, Math.min(1, v));
}

export default function Page() {
  const reduceMotion = useReducedMotion() ?? false;
  const triggerRef = useRef<HTMLElement>(null);
  const bgRowsRef = useRef<(HTMLParagraphElement | null)[]>([]);
  const wordRef = useRef<HTMLHeadingElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const triggerEl = triggerRef.current;
    const wordEl = wordRef.current;
    const lineEl = lineRef.current;
    if (!triggerEl || !wordEl || !lineEl) return;

    if (reduceMotion) {
      wordEl.textContent = FRONT_WORD;
      lineEl.style.transform = "scaleX(1)";
      bgRowsRef.current.forEach((row) => {
        if (!row) return;
        row.style.opacity = "0.9";
        row.style.transform = "translateX(0px)";
      });
      return;
    }

    let rafId = 0;

    const update = () => {
      const rect = triggerEl.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const rawProgress = (vh * 0.9 - rect.top) / (vh * 0.8);
      const sectionProgress = clamp01(rawProgress);

      const rows = bgRowsRef.current.filter(Boolean) as HTMLParagraphElement[];
      rows.forEach((row, i) => {
        const rowProgress = clamp01((sectionProgress - i * 0.015) * 2.2);
        const direction = i % 2 === 0 ? -1 : 1;
        const offset = (1 - rowProgress) * window.innerWidth * 0.24 * direction;
        row.style.opacity = String(0.08 + rowProgress * 0.82);
        row.style.transform = `translateX(${offset}px)`;
      });

      const lineProgress = clamp01((sectionProgress - 0.26) / 0.34);
      lineEl.style.transform = `scaleX(${lineProgress})`;

      const typingProgress = clamp01((sectionProgress - 0.34) / 0.5);
      const visibleChars = Math.round(FRONT_WORD.length * typingProgress);
      wordEl.textContent = FRONT_WORD.slice(0, visibleChars);
    };

    const onScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [reduceMotion]);

  return (
    <main className={styles.page}>
      <section className={styles.intro}>
        <h1 className={styles.title}>dev-burst-overlay</h1>
        <p className={styles.copy}>
          背景に白文字のバースト、前面に黒文字タイピングを重ねる。
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
            {reduceMotion ? "konchiwa" : ""}
          </h2>
          <div ref={lineRef} className={styles.underline} />
        </div>
      </section>
    </main>
  );
}
