import { useEffect, useRef, useState } from "react";
import {
  clamp01,
  easeOutCubic,
  rowCloseLocal,
  rowOpenLocal,
} from "../../lib/barcodeTextBridgeMath";
import { productionHomeCopy } from "../../lib/translations";
import styles from "./DevBarcodeFlipTransitionText.module.css";

const INITIAL_LINE_COUNT = 16;
const REPEAT_N = 15;

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
const CURTAIN_LINE = Array.from({ length: REPEAT_N }, () => ja.greetingBgRowText).join(" ");

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
  const trackRef = useRef<HTMLDivElement>(null);
  const measureRowRef = useRef<HTMLParagraphElement>(null);
  const layerARef = useRef<HTMLElement>(null);
  const layerBRef = useRef<HTMLElement>(null);
  const leftRefs = useRef<Array<HTMLDivElement | null>>([]);
  const rightRefs = useRef<Array<HTMLDivElement | null>>([]);
  const rafRef = useRef(0);
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

  useEffect(() => {
    if (reduceMotion) return;

    const track = trackRef.current;
    if (!track) return;

    const update = () => {
      const scrollY = window.scrollY;
      const trackTop = track.getBoundingClientRect().top + scrollY;
      const range = track.offsetHeight - window.innerHeight;
      const p = range > 0 ? clamp01((scrollY - trackTop) / range) : 0;

      const showA = p < 0.5;
      const layerA = layerARef.current;
      const layerB = layerBRef.current;
      if (layerA) {
        layerA.classList.toggle(styles.layerOn, showA);
        layerA.classList.toggle(styles.layerOff, !showA);
        layerA.setAttribute("aria-hidden", String(!showA));
      }
      if (layerB) {
        layerB.classList.toggle(styles.layerOn, !showA);
        layerB.classList.toggle(styles.layerOff, showA);
        layerB.setAttribute("aria-hidden", String(showA));
      }

      const n = lineCount;

      if (p < 0.5) {
        const t = p / 0.5;
        for (let i = 0; i < n; i += 1) {
          const left = leftRefs.current[i];
          const right = rightRefs.current[i];
          if (!left || !right) continue;
          const lp = easeOutCubic(rowCloseLocal(t, i, n));
          left.style.transform = `translate3d(${-105 + lp * 105}%, 0, 0)`;
          right.style.transform = `translate3d(${105 - lp * 105}%, 0, 0)`;
        }
      } else {
        const t = (p - 0.5) / 0.5;
        for (let i = 0; i < n; i += 1) {
          const left = leftRefs.current[i];
          const right = rightRefs.current[i];
          if (!left || !right) continue;
          const lp = easeOutCubic(rowOpenLocal(t, i, n));
          left.style.transform = `translate3d(${-lp * 105}%, 0, 0)`;
          right.style.transform = `translate3d(${lp * 105}%, 0, 0)`;
        }
      }
    };

    const onScroll = () => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(rafRef.current);
    };
  }, [reduceMotion, lineCount]);

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
      <div ref={trackRef} className={styles.track}>
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
              ref={layerARef}
              className={`${styles.layer} ${styles.layerA} ${styles.layerOn}`}
              aria-hidden={false}
            >
              <h1 className={styles.title}>{SCREENS[0].title}</h1>
              <p className={styles.body}>{SCREENS[0].body}</p>
              <p className={styles.hint}>ゆっくり下へスクロールしてください。</p>
              <div className={styles.actions}>
                <a className={styles.btnGhost} href="/dev-barcode-flip-transition">
                  単色バンド版
                </a>
                <a className={styles.btnGhost} href="/dev">
                  /dev に戻る
                </a>
              </div>
            </section>

            <section
              ref={layerBRef}
              className={`${styles.layer} ${styles.layerB} ${styles.layerOff}`}
              aria-hidden={true}
            >
              <h1 className={styles.title}>{SCREENS[1].title}</h1>
              <p className={styles.body}>{SCREENS[1].body}</p>
              <p className={styles.hint}>上にスクロールすると A に戻ります。</p>
              <div className={styles.actions}>
                <a className={styles.btnGhost} href="/dev-barcode-flip-transition">
                  単色バンド版
                </a>
                <a className={styles.btnGhost} href="/dev">
                  /dev に戻る
                </a>
              </div>
            </section>

            <div className={styles.curtain} aria-hidden="true">
              {Array.from({ length: lineCount }, (_, i) => {
                const lineClass = i % 2 === 0 ? styles.curtainLine : styles.curtainLineAlt;
                return (
                  <div key={i} className={styles.row}>
                    <div
                      ref={(el) => {
                        leftRefs.current[i] = el;
                      }}
                      className={styles.half}
                    >
                      <div className={styles.halfClip}>
                        <p className={lineClass}>{CURTAIN_LINE}</p>
                      </div>
                    </div>
                    <div
                      ref={(el) => {
                        rightRefs.current[i] = el;
                      }}
                      className={styles.half}
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
