import { animate, onScroll } from "animejs";
import { useEffect, useMemo, useRef, useState } from "react";
import { CurtainMarquee } from "../../components/curtain/CurtainMarquee";
import { productionHomeCopy } from "../../lib/translations";
import styles from "./DevBarcodeFlipTransitionTextAnime.module.css";

const INITIAL_LINE_COUNT = 16;
const REPEAT_N = 15;
const MOTION_PRESETS = {
  // 旧ページ寄せ
  legacy: {
    closeBase: 0.06,
    closeStep: 0.022,
    openBase: 0.36,
    openStep: 0.011,
    phaseSpan: 0.14,
  },
  // 少し均一寄り
  soft: {
    closeBase: 0.05,
    closeStep: 0.016,
    openBase: 0.34,
    openStep: 0.008,
    phaseSpan: 0.13,
  },
  // 遅延を強調
  dramatic: {
    closeBase: 0.07,
    closeStep: 0.028,
    openBase: 0.38,
    openStep: 0.014,
    phaseSpan: 0.16,
  },
} as const;

const ACTIVE_PRESET = MOTION_PRESETS.legacy;

const SCREENS = [
  {
    id: "a",
    title: "テキスト帯 A",
    body: "Anime.js の onScroll でカーテンを閉じ、A→B の切替を同期させています。",
  },
  {
    id: "b",
    title: "テキスト帯 B",
    body: "カーテンの左右移動とレイヤー表示はすべて JS 駆動です。上スクロールで逆再生します。",
  },
] as const;

const ja = productionHomeCopy.ja;
const CURTAIN_LINE = Array.from(
  { length: REPEAT_N },
  () => ja.greetingBgRowText,
).join(" ");

function clamp01(value: number) {
  if (value < 0) return 0;
  if (value > 1) return 1;
  return value;
}

function lerp(from: number, to: number, progress: number) {
  return from + (to - from) * progress;
}

function easeOutExpo(progress: number) {
  const p = clamp01(progress);
  if (p === 1) return 1;
  return 1 - 2 ** (-10 * p);
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
  const measureRowRef = useRef<HTMLParagraphElement>(null);
  const curtainLeftRefs = useRef<Array<HTMLDivElement | null>>([]);
  const curtainRightRefs = useRef<Array<HTMLDivElement | null>>([]);
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
      const desired = Math.ceil(window.innerHeight / rowHeight) + buffer;
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

  const rowTiming = useMemo(
    () =>
      Array.from({ length: lineCount }, (_, i) => {
        const edgeDistance = Math.min(i, lineCount - 1 - i);
        const reverseDistance = Math.max(i, lineCount - 1 - i);
        const closeStart =
          ACTIVE_PRESET.closeBase + edgeDistance * ACTIVE_PRESET.closeStep;
        const closeEnd = closeStart + ACTIVE_PRESET.phaseSpan;
        const openStart =
          ACTIVE_PRESET.openBase + reverseDistance * ACTIVE_PRESET.openStep;
        const openEnd = openStart + ACTIVE_PRESET.phaseSpan;
        return { closeStart, closeEnd, openStart, openEnd };
      }),
    [lineCount],
  );

  useEffect(() => {
    if (reduceMotion) return;
    const track = trackRef.current;
    const layerA = layerARef.current;
    const layerB = layerBRef.current;
    if (!track || !layerA || !layerB) return;

    const applyProgress = (progress: number) => {
      rowTiming.forEach((timing, i) => {
        const left = curtainLeftRefs.current[i];
        const right = curtainRightRefs.current[i];
        if (!left || !right) return;

        const closeRaw = clamp01(
          (progress - timing.closeStart) /
            (timing.closeEnd - timing.closeStart),
        );
        const openRaw = clamp01(
          (progress - timing.openStart) / (timing.openEnd - timing.openStart),
        );
        const close = easeOutExpo(closeRaw);
        const open = easeOutExpo(openRaw);

        const leftX = open > 0 ? lerp(0, -105, open) : lerp(-105, 0, close);
        const rightX = open > 0 ? lerp(0, 105, open) : lerp(105, 0, close);
        left.style.transform = `translate3d(${leftX}%, 0, 0)`;
        right.style.transform = `translate3d(${rightX}%, 0, 0)`;
      });

      const swap = clamp01((progress - 0.44) / 0.12);
      layerA.style.opacity = String(1 - swap);
      layerB.style.opacity = String(swap);
      const bVisible = swap > 0.5;
      layerA.style.pointerEvents = bVisible ? "none" : "auto";
      layerB.style.pointerEvents = bVisible ? "auto" : "none";
      layerA.style.visibility = bVisible ? "hidden" : "visible";
      layerB.style.visibility = bVisible ? "visible" : "hidden";
      layerA.style.zIndex = bVisible ? "1" : "2";
      layerB.style.zIndex = bVisible ? "2" : "1";
    };

    applyProgress(0);

    const scrub = animate(track, {
      // opacity: [1, 1],
      // duration: 1,
      ease: "linear",
      autoplay: onScroll({
        target: track,
        enter: "top top",
        leave: "bottom bottom",
        sync: true,
        onUpdate: (self) => {
          const observer = self as { progress?: number };
          if (typeof observer.progress !== "number") return;
          applyProgress(clamp01(observer.progress));
        },
      }),
    });

    return () => {
      scrub.revert();
      applyProgress(0);
    };
  }, [reduceMotion, rowTiming]);

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
              className={`${styles.layer} ${styles.layerA}`}
            >
              <h1 className={styles.title}>{SCREENS[0].title}</h1>
              <p className={styles.body}>{SCREENS[0].body}</p>
              <p className={styles.hint}>
                ゆっくり下へスクロールしてください。
              </p>
              <div className={styles.actions}>
                <a
                  className={styles.btnGhost}
                  href="/dev-barcode-flip-transition-text"
                >
                  元ページ
                </a>
                <a className={styles.btnGhost} href="/dev">
                  /dev に戻る
                </a>
              </div>
            </section>

            <section
              ref={layerBRef}
              className={`${styles.layer} ${styles.layerB}`}
            >
              <h1 className={styles.title}>{SCREENS[1].title}</h1>
              <p className={styles.body}>{SCREENS[1].body}</p>
              <p className={styles.hint}>上にスクロールすると A に戻ります。</p>
              <div className={styles.actions}>
                <a
                  className={styles.btnGhost}
                  href="/dev-barcode-flip-transition-text"
                >
                  元ページ
                </a>
                <a className={styles.btnGhost} href="/dev">
                  /dev に戻る
                </a>
              </div>
            </section>

            <CurtainMarquee
              styles={styles}
              lineCount={lineCount}
              lineText={CURTAIN_LINE}
              onLeftHalfRef={(i, el) => {
                curtainLeftRefs.current[i] = el;
              }}
              onRightHalfRef={(i, el) => {
                curtainRightRefs.current[i] = el;
              }}
            />
          </div>
        </div>
      </div>

      <div className={styles.tail} aria-hidden="true" />
    </div>
  );
}
