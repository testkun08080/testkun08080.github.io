import { useEffect, useRef, useState, type CSSProperties } from "react";
import { productionHomeCopy } from "../../lib/translations";
import styles from "./DevBarcodeFlipTransitionText.module.css";

const INITIAL_LINE_COUNT = 16;
const REPEAT_N = 15;
const CLOSE_BASE = 6;
const CLOSE_STEP = 2.2;
const OPEN_BASE = 36;
const OPEN_STEP = 1.1;
const PHASE_SPAN = 14;

const SCREENS = [
  {
    id: "a",
    title: "テキスト帯 A",
    body: "本番の挨拶で使っている greetingBgRowText（日本語）を流し、行数は画面の高さに応じて増減します。",
  },
  {
    id: "b",
    title: "テキスト帯 B",
    body: "オーバーレイの文言は同じです。下へスクロールで覆い、切り替え後に左右から開きます。",
  },
] as const;

const ja = productionHomeCopy.ja;
const CURTAIN_LINE = Array.from(
  { length: REPEAT_N },
  () => ja.greetingBgRowText,
).join(" ");

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
  const measureRowRef = useRef<HTMLParagraphElement>(null);
  const [lineCount, setLineCount] = useState(INITIAL_LINE_COUNT);

  useEffect(() => {
    const measure = measureRowRef.current;
    if (!measure) return;

    const updateCount = () => {
      const rowHeight = measure.getBoundingClientRect().height;
      if (rowHeight <= 0) return;
      const isMobile = window.matchMedia("(max-width: 640px)").matches;
      const minRows = isMobile ? 10 : 12;
      const maxRows = isMobile ? 32 : 40;
      const buffer = isMobile ? 1 : 2;
      const viewportHeight = window.innerHeight;
      const desired = Math.ceil(viewportHeight / rowHeight) + buffer;
      const nextCount = Math.min(maxRows, Math.max(minRows, desired));
      setLineCount((prev) => (prev === nextCount ? prev : nextCount));
    };

    let rafId = 0;
    const schedule = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(updateCount);
    };

    schedule();
    window.addEventListener("resize", schedule, { passive: true });
    window.addEventListener("orientationchange", schedule, { passive: true });

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("orientationchange", schedule);
    };
  }, []);

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
            <p
              ref={measureRowRef}
              className={`${styles.curtainLine} ${styles.measureRow}`}
              aria-hidden
            >
              {ja.greetingBgRowText}
            </p>

            <section
              className={`${styles.layer} ${styles.layerA}`}
              aria-hidden={false}
            >
              <h1 className={styles.title}>{SCREENS[0].title}</h1>
              <p className={styles.body}>{SCREENS[0].body}</p>
              <p className={styles.hint}>
                ゆっくり下へスクロールしてください。
              </p>
              <div className={styles.actions}>
                <a
                  className={styles.btnGhost}
                  href="/dev-barcode-flip-transition"
                >
                  単色バンド版
                </a>
                <a className={styles.btnGhost} href="/dev">
                  /dev に戻る
                </a>
              </div>
            </section>

            <section
              className={`${styles.layer} ${styles.layerB}`}
              aria-hidden={true}
            >
              <h1 className={styles.title}>{SCREENS[1].title}</h1>
              <p className={styles.body}>{SCREENS[1].body}</p>
              <p className={styles.hint}>上にスクロールすると A に戻ります。</p>
              <div className={styles.actions}>
                <a
                  className={styles.btnGhost}
                  href="/dev-barcode-flip-transition"
                >
                  単色バンド版
                </a>
                <a className={styles.btnGhost} href="/dev">
                  /dev に戻る
                </a>
              </div>
            </section>

            <div className={styles.curtain} aria-hidden="true">
              {Array.from({ length: lineCount }, (_, i) => {
                const edgeDistance = Math.min(i, lineCount - 1 - i);
                const reverseDistance = Math.max(i, lineCount - 1 - i);
                const closeStart = CLOSE_BASE + edgeDistance * CLOSE_STEP;
                const closeEnd = closeStart + PHASE_SPAN;
                const openStart = OPEN_BASE + reverseDistance * OPEN_STEP;
                const openEnd = openStart + PHASE_SPAN;
                const lineClass =
                  i % 2 === 0 ? styles.curtainLine : styles.curtainLineAlt;
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
                      <div className={styles.halfClip}>
                        <p className={lineClass}>{CURTAIN_LINE}</p>
                      </div>
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
                      <div className={styles.halfClip}>
                        <p className={lineClass}>{CURTAIN_LINE}</p>
                      </div>
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
