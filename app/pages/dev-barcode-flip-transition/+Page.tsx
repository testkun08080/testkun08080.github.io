import { useEffect, useState, type CSSProperties } from "react";
import styles from "./DevBarcodeFlipTransition.module.css";

const LINE_COUNT = 28;
const CLOSE_BASE = 6;
const CLOSE_STEP = 2.2;
const OPEN_BASE = 36;
const OPEN_STEP = 1.1;
const PHASE_SPAN = 14;

const SCREENS = [
  {
    id: "a",
    title: "画面 A",
    body: "下にスクロールすると、横ラインが左右から順に寄り、中央で画面が切り替わります。",
  },
  {
    id: "b",
    title: "画面 B",
    body: "さらにスクロールすると同じラインが開いて B が見えます。上に戻すと逆に再生されます。",
  },
] as const;

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

  if (reduceMotion) {
    return (
      <main className={styles.page}>
        <div className={styles.reduceStack}>
          <section className={`${styles.reduceSection} ${styles.reduceA}`}>
            <h1 className={styles.title}>{SCREENS[0].title}</h1>
            <p className={styles.body}>{SCREENS[0].body}</p>
          </section>
          <section className={`${styles.reduceSection} ${styles.reduceB}`}>
            <h1 className={styles.title}>{SCREENS[1].title}</h1>
            <p className={styles.body}>{SCREENS[1].body}</p>
          </section>
          <a className={styles.btnGhost} href="/dev">
            /dev に戻る
          </a>
        </div>
      </main>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.track}>
        <div className={styles.pin}>
          <div className={styles.scene}>
            <section
              className={`${styles.layer} ${styles.layerA}`}
              aria-hidden={false}
            >
              <h1 className={styles.title}>{SCREENS[0].title}</h1>
              <p className={styles.body}>{SCREENS[0].body}</p>
              <p className={styles.hint}>ゆっくり下へスクロールしてください。</p>
              <div className={styles.actions}>
                <a className={styles.btnGhost} href="/dev">
                  /dev に戻る
                </a>
              </div>
            </section>

            <section className={`${styles.layer} ${styles.layerB}`} aria-hidden={true}>
              <h1 className={styles.title}>{SCREENS[1].title}</h1>
              <p className={styles.body}>{SCREENS[1].body}</p>
              <p className={styles.hint}>上にスクロールすると A に戻ります。</p>
              <div className={styles.actions}>
                <a className={styles.btnGhost} href="/dev">
                  /dev に戻る
                </a>
              </div>
            </section>

            <div className={styles.curtain} aria-hidden="true">
              {Array.from({ length: LINE_COUNT }, (_, i) => {
                const edgeDistance = Math.min(i, LINE_COUNT - 1 - i);
                const reverseDistance = Math.max(i, LINE_COUNT - 1 - i);
                const closeStart = CLOSE_BASE + edgeDistance * CLOSE_STEP;
                const closeEnd = closeStart + PHASE_SPAN;
                const openStart = OPEN_BASE + reverseDistance * OPEN_STEP;
                const openEnd = openStart + PHASE_SPAN;
                const darkLeft = i % 2 === 0;
                return (
                  <div key={i} className={styles.row}>
                    <div
                      className={`${styles.half} ${styles.halfLeft}`}
                      style={
                        {
                          "--close-start": `${closeStart}%`,
                          "--close-end": `${closeEnd}%`,
                          "--open-start": `${openStart}%`,
                          "--open-end": `${openEnd}%`,
                        } as CSSProperties
                      }
                    >
                      <div className={`${styles.panel} ${darkLeft ? styles.halfDark : styles.halfLight}`} />
                    </div>
                    <div
                      className={`${styles.half} ${styles.halfRight}`}
                      style={
                        {
                          "--close-start": `${closeStart}%`,
                          "--close-end": `${closeEnd}%`,
                          "--open-start": `${openStart}%`,
                          "--open-end": `${openEnd}%`,
                        } as CSSProperties
                      }
                    >
                      <div className={`${styles.panel} ${darkLeft ? styles.halfLight : styles.halfDark}`} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className={styles.tail} aria-hidden="true" />
    </div>
  );
}
