import { animate, createScope, onScroll } from "animejs";
import { useEffect, useRef } from "react";
import styles from "./DevAnimeOnscrollSquare.module.css";

export default function Page() {
  const rootRef = useRef<HTMLElement>(null);
  const scopeRef = useRef<ReturnType<typeof createScope> | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const squareRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!rootRef.current || !scrollContainerRef.current || !squareRef.current) {
      return;
    }

    scopeRef.current = createScope({ root: rootRef.current! }).add(() => {
      animate(squareRef.current!, {
        x: "15rem",
        rotate: "1turn",
        ease: "linear",
        autoplay: onScroll({
          container: scrollContainerRef.current!,
          // target: squareRef.current!,
          enter: "bottom-=50 top",
          leave: "top+=60 bottom",
          sync: true,
          debug: true,
        }),
      });
    });

    return () => {
      scopeRef.current?.revert();
      scopeRef.current = null;
    };
  }, []);

  return (
    <main ref={rootRef} className={styles.page}>
      <section className={styles.intro}>
        <h1 className={styles.title}>dev-anime-onscroll-square</h1>
        <p className={styles.copy}>
          スクロール位置に同期して、四角形が横移動＋回転するサンプルです。
        </p>
      </section>

      <div
        ref={scrollContainerRef}
        className={`${styles.scrollContainer} scroll-container`}
      >
        <div className={`${styles.scrollContent} scroll-content`}>
          <div className={`${styles.scrollSection} ${styles.padded}`}>
            <div className={styles.largeRow}>
              <div className={styles.label}>scroll down</div>
            </div>
          </div>

          <div className={`${styles.scrollSection} ${styles.padded}`}>
            <div className={styles.largeRow}>
              <div ref={squareRef} className={`${styles.square} square`} />
            </div>
          </div>

          <div className={styles.scrollSection} />
        </div>
      </div>
    </main>
  );
}
