import { useEffect, useRef, useState } from "react";
import styles from "./DevBarcodeFlipTransition.module.css";

const LINE_COUNT = 28;

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

/** ストライプが閉じる／開く波の幅（0〜1 の位相内） */
const WAVE = 0.26;

function clamp01(v: number) {
  return Math.min(1, Math.max(0, v));
}

function easeOutCubic(t: number) {
  return 1 - (1 - t) ** 3;
}

/** 閉じる位相 t ∈ [0,1] — 上の行から順に中央へ */
function rowCloseLocal(t: number, index: number, n: number) {
  if (n <= 1) return clamp01(t);
  const start = (index / (n - 1)) * (1 - WAVE);
  return clamp01((t - start) / WAVE);
}

/** 開く位相 t ∈ [0,1] — 閉じた逆順（下の行から開く） */
function rowOpenLocal(t: number, index: number, n: number) {
  if (n <= 1) return clamp01(t);
  const reverseIndex = n - 1 - index;
  const start = (reverseIndex / (n - 1)) * (1 - WAVE);
  return clamp01((t - start) / WAVE);
}

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
  const layerARef = useRef<HTMLElement>(null);
  const layerBRef = useRef<HTMLElement>(null);
  const leftRefs = useRef<Array<HTMLDivElement | null>>([]);
  const rightRefs = useRef<Array<HTMLDivElement | null>>([]);
  const rafRef = useRef<number>(0);

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

      if (p < 0.5) {
        const t = p / 0.5;
        for (let i = 0; i < LINE_COUNT; i += 1) {
          const left = leftRefs.current[i];
          const right = rightRefs.current[i];
          if (!left || !right) continue;
          const lp = easeOutCubic(rowCloseLocal(t, i, LINE_COUNT));
          left.style.transform = `translate3d(${-105 + lp * 105}%, 0, 0)`;
          right.style.transform = `translate3d(${105 - lp * 105}%, 0, 0)`;
        }
      } else {
        const t = (p - 0.5) / 0.5;
        for (let i = 0; i < LINE_COUNT; i += 1) {
          const left = leftRefs.current[i];
          const right = rightRefs.current[i];
          if (!left || !right) continue;
          const lp = easeOutCubic(rowOpenLocal(t, i, LINE_COUNT));
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
  }, [reduceMotion]);

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
            <section
              ref={layerARef}
              className={`${styles.layer} ${styles.layerA} ${styles.layerOn}`}
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

            <section
              ref={layerBRef}
              className={`${styles.layer} ${styles.layerB} ${styles.layerOff}`}
              aria-hidden={true}
            >
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
                const darkLeft = i % 2 === 0;
                return (
                  <div key={i} className={styles.row}>
                    <div
                      ref={(el) => {
                        leftRefs.current[i] = el;
                      }}
                      className={`${styles.half} ${darkLeft ? styles.halfDark : styles.halfLight}`}
                    />
                    <div
                      ref={(el) => {
                        rightRefs.current[i] = el;
                      }}
                      className={`${styles.half} ${darkLeft ? styles.halfLight : styles.halfDark}`}
                    />
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
