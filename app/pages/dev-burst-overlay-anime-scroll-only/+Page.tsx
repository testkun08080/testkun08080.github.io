import { animate, createScope, onScroll } from "animejs";
import { useEffect, useRef } from "react";
import styles from "./DevBurstOverlayAnimeScrollOnly.module.css";

const FRONT_WORD = "konchiwa";

export default function Page() {
  const rootRef = useRef<HTMLElement>(null);
  const scopeRef = useRef<ReturnType<typeof createScope> | null>(null);
  const wordRef = useRef<HTMLHeadingElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const typedCountRef = useRef(-1);

  useEffect(() => {
    if (!rootRef.current) return;

    const wordEl = wordRef.current;
    const lineEl = lineRef.current;
    if (!wordEl || !lineEl) return;
    wordEl.textContent = "";

    scopeRef.current = createScope({ root: rootRef.current }).add(() => {
      animate(lineEl, {
        scaleX: [0, 1],
        // duration: 100,
        // ease: "linear",
        autoplay: onScroll({
          enter: "bottom top",
          leave: "center top-=100",
          sync: true,
          // repeat: true,
          debug: true,
        }),
      });

      animate(wordEl, {
        // opacity: [1, 1],
        autoplay: onScroll({
          enter: "bottom top",
          leave: "center center",
          sync: true,
          debug: true,
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
      wordEl.textContent = FRONT_WORD;
      typedCountRef.current = -1;
    };
  }, []);

  return (
    <main ref={rootRef} className={styles.page}>
      <section className={styles.intro}>
        <h1 className={styles.title}>dev-burst-overlay-anime-scroll-only</h1>
        <p className={styles.copy}>
          ラインとタイピングだけをスクロール同期したページ（animejs）。
        </p>
      </section>

      <section className={styles.stage}>
        <div className={styles.frontLayer}>
          <h2 ref={wordRef} className={styles.word}>
            {FRONT_WORD}
          </h2>
          <div ref={lineRef} className={styles.underline} />
        </div>
      </section>
    </main>
  );
}
