import { animate, createScope, onScroll, stagger } from "animejs";
import { useEffect, useRef } from "react";
import styles from "./DevAnimeScrollSimple.module.css";

export default function Page() {
  const rootRef = useRef<HTMLElement>(null);
  const scopeRef = useRef<ReturnType<typeof createScope> | null>(null);
  const fadeRowRef = useRef<HTMLDivElement>(null);
  const syncBoxRef = useRef<HTMLDivElement>(null);
  const cardGridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (
      !rootRef.current ||
      !fadeRowRef.current ||
      !syncBoxRef.current ||
      !cardGridRef.current
    ) {
      return;
    }

    const fadeRow = fadeRowRef.current;
    const syncBox = syncBoxRef.current;
    const cardGrid = cardGridRef.current;

    scopeRef.current = createScope({ root: rootRef.current }).add(() => {
      // 1) ワンショット: 初期状態を autoplay: false で停止しておき、
      animate(`.${styles.fadeItem}`, {
        opacity: [0, 1],
        y: [40, 0],
        duration: 800,
        ease: "outQuad",
        delay: stagger(80),
        autoplay: onScroll({
          target: fadeRow,
          enter: "bottom-=80 top",
          leave: "top bottom",
          sync: true,
          repeat: false,
          debug: true,
        }),
      });

      // 2) スクロール量に同期 (sync: true)
      animate(syncBox, {
        rotate: "1turn",
        x: ["-40%", "40%"],
        ease: "linear",
        autoplay: onScroll({
          // target: syncBox,
          enter: "bottom top",
          leave: "top bottom",
          sync: true,
          repeat: false,
          debug: true,
        }),
      });

      // 3) stagger reveal (ワンショット、同じく onEnter で発火)
      const cardAnim = animate(`.${styles.card}`, {
        opacity: [0, 1],
        y: [60, 0],
        delay: stagger(120),
        duration: 700,
        ease: "outCubic",
        autoplay: onScroll({
          target: cardGrid,
          enter: "bottom-=80 top",
          leave: "top bottom",
          repeat: false,
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
      <section className={styles.hero}>
        <h1 className={styles.title}>dev-anime-scroll-simple</h1>
        <p className={styles.copy}>
          anime.js v4 の <code>onScroll</code>{" "}
          を使った最小構成のスクロールアニメ。 下にスクロールしてください。
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>
          1. fade + slide-in (onEnter で1回再生)
        </h2>
        <p className={styles.sectionDesc}>
          要素が画面に入った瞬間に1回だけ再生されます。
        </p>
        <div ref={fadeRowRef} className={styles.fadeRow}>
          <div className={styles.fadeItem}>Hello</div>
          <div className={styles.fadeItem}>anime.js</div>
          <div className={styles.fadeItem}>v4</div>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>2. scroll-synced (sync: true)</h2>
        <p className={styles.sectionDesc}>
          スクロール量に同期して回転と横移動。戻すと逆再生されます。
        </p>
        <div className={styles.syncStage}>
          <div ref={syncBoxRef} className={styles.syncBox} />
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>
          3. stagger reveal (onEnter で1回再生)
        </h2>
        <p className={styles.sectionDesc}>
          複数要素を <code>stagger</code> で順番にフェードイン。
        </p>
        <div ref={cardGridRef} className={styles.cardGrid}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className={styles.card}>
              card {i + 1}
            </div>
          ))}
        </div>
      </section>

      <section className={styles.tail} />
    </main>
  );
}
