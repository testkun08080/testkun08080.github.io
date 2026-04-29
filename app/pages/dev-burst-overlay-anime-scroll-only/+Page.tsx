import { animate, createScope, onScroll, splitText, stagger } from "animejs";
import { useEffect, useRef } from "react";
import styles from "./DevBurstOverlayAnimeScrollOnly.module.css";

const FRONT_WORD = "konchiwa";

export default function Page() {
  const rootRef = useRef<HTMLElement>(null);
  const scopeRef = useRef<ReturnType<typeof createScope> | null>(null);
  const wordRef = useRef<HTMLHeadingElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!rootRef.current) return;

    const wordEl = wordRef.current;
    const lineEl = lineRef.current;
    if (!wordEl || !lineEl) return;

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

      const { chars } = splitText(wordEl, {
        chars: { wrap: "clip" },
      });

      animate(chars, {
        y: [{ to: ["100%", "0%"] }, { to: "0%", delay: 750 }],
        // duration: 500,
        delay: stagger(50),
        autoplay: onScroll({
          enter: "bottom top",
          leave: "center bottom",
          sync: true,
          // repeat: true,
          debug: true,
        }),
      });
    });

    return () => {
      scopeRef.current?.revert();
      scopeRef.current = null;
      wordEl.textContent = "";
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
