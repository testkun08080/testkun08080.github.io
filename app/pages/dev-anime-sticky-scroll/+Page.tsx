import { animate, createScope, onScroll } from "animejs";
import { useEffect, useRef } from "react";
import styles from "./DevAnimeStickyScroll.module.css";

const FRONT_TEXT = "STICKY";

export default function Page() {
  const rootRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLElement>(null);
  const frontTextRef = useRef<HTMLHeadingElement>(null);
  const scopeRef = useRef<ReturnType<typeof createScope> | null>(null);
  const typedCountRef = useRef(-1);

  useEffect(() => {
    if (!rootRef.current || !trackRef.current || !frontTextRef.current) return;

    const track = trackRef.current;
    const frontText = frontTextRef.current;
    const updateTypingByProgress = (progress: unknown) => {
      if (typeof progress !== "number") return;
      const clamped = Math.min(Math.max(progress, 0), 1);
      const nextCount = Math.floor(clamped * FRONT_TEXT.length);
      if (nextCount === typedCountRef.current) return;
      typedCountRef.current = nextCount;
      frontText.textContent = FRONT_TEXT.slice(0, nextCount);
    };
    frontText.textContent = "";

    scopeRef.current = createScope({ root: rootRef.current }).add(() => {
      animate(frontText, {
        scale: [0.88, 1.25],
        opacity: [0.45, 1],
        letterSpacing: ["0.02em", "0.2em"],
        ease: "linear",
        autoplay: onScroll({
          target: track,
          enter: "top top",
          leave: "bottom bottom",
          sync: true,
          debug: false,
          onUpdate: (self) => {
            const observer = self as { progress?: number };
            updateTypingByProgress(observer.progress);
          },
        }),
      });

      animate(`.${styles.bgRow}`, {
        x: (_el, i) => (i % 2 === 0 ? "-14vw" : "14vw"),
        opacity: [0.12, 0.9],
        scale: [0.96, 1.08],
        ease: "linear",
        autoplay: onScroll({
          target: track,
          enter: "top top",
          leave: "bottom bottom",
          sync: true,
          debug: false,
        }),
      });
    });

    return () => {
      scopeRef.current?.revert();
      scopeRef.current = null;
      frontText.textContent = FRONT_TEXT;
      typedCountRef.current = -1;
    };
  }, []);

  return (
    <main ref={rootRef} className={styles.page}>
      <section className={styles.intro}>
        <h1 className={styles.title}>dev-anime-sticky-scroll</h1>
        <p className={styles.copy}>
          前面テキストは sticky
          で固定。スクロールすると背景とテキストが連動で変化します。
        </p>
      </section>

      <section ref={trackRef} className={styles.track}>
        <div className={styles.stickyStage}>
          <div className={styles.bgLayer}>
            {Array.from({ length: 18 }).map((_, i) => (
              <p key={i} className={styles.bgRow}>
                SCROLL REACTION DEMO - STICKY FRONT TEXT - ANIMEJS
              </p>
            ))}
          </div>

          <div className={styles.frontLayer}>
            <h2 ref={frontTextRef} className={styles.frontText}>
              {FRONT_TEXT}
            </h2>
            <p className={styles.frontSub}>scroll to morph</p>
          </div>
        </div>
      </section>

      <section className={styles.outro}>
        <p>End of demo area.</p>
      </section>
    </main>
  );
}
