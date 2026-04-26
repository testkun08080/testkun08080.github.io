import { useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";
import { createTimeline, splitText, stagger } from "animejs";
import heroImage from "../../images/hero.png";
import styles from "./DevSideCenter.module.css";

const WORDS = [
  "hi there h",
  "white words",
  "side center",
  "scroll move",
  "testkun08080",
  "hello world",
] as const;

const LINE_COUNT = 36;
const START_OFFSET_VW = 26;

function clamp01(v: number) {
  return Math.max(0, Math.min(1, v));
}

export default function Page() {
  const reduceMotion = useReducedMotion() ?? false;
  const triggerRef = useRef<HTMLElement>(null);
  const leftBlockRef = useRef<HTMLDivElement>(null);
  const rightBlockRef = useRef<HTMLDivElement>(null);
  const centerRef = useRef<HTMLDivElement>(null);
  const splitDemoRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const triggerEl = triggerRef.current;
    const left = leftBlockRef.current;
    const right = rightBlockRef.current;
    const center = centerRef.current;
    if (!triggerEl || !left || !right || !center) return;

    if (reduceMotion) {
      left.style.transform = "translate3d(0, 0, 0)";
      right.style.transform = "translate3d(0, 0, 0)";
      center.style.opacity = "1";
      center.style.transform = "translateY(0)";
      return;
    }

    let rafId = 0;

    const update = () => {
      const rect = triggerEl.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const progress = clamp01((vh - rect.top) / (vh * 1.1));
      const eased = 1 - (1 - progress) ** 3;
      const remainingOffset = (1 - eased) * START_OFFSET_VW;
      left.style.transform = `translate3d(${remainingOffset}vw, 0, 0)`;
      right.style.transform = `translate3d(${-remainingOffset}vw, 0, 0)`;

      const centerProgress = clamp01((progress - 0.2) / 0.45);
      center.style.opacity = String(centerProgress);
      center.style.transform = `translateY(${(1 - centerProgress) * 24}px)`;
    };

    const onScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [reduceMotion]);

  useEffect(() => {
    const target = splitDemoRef.current;
    if (!target) return;
    if (reduceMotion) {
      target.textContent = "Custom HTML template.";
      return;
    }

    const splitter = splitText(target, {
      chars: `<span class="char-3d word-{i}">
        <em class="face face-top">{value}</em>
        <em class="face face-front">{value}</em>
        <em class="face face-bottom">{value}</em>
      </span>`,
    });

    const charsStagger = stagger(100, { start: 0 });
    const timeline = createTimeline({
      defaults: { ease: "linear", loop: true, duration: 750 },
    });
    timeline
      .add(".char-3d", { rotateX: -90 }, charsStagger)
      .add(".char-3d .face-top", { opacity: [0.5, 0] }, charsStagger)
      .add(".char-3d .face-front", { opacity: [1, 0.5] }, charsStagger)
      .add(".char-3d .face-bottom", { opacity: [0.5, 1] }, charsStagger);

    return () => {
      if (typeof (timeline as { revert?: () => void }).revert === "function") {
        (timeline as { revert: () => void }).revert();
      }
      if (typeof (splitter as { revert?: () => void }).revert === "function") {
        (splitter as { revert: () => void }).revert();
      }
    };
  }, [reduceMotion]);

  return (
    <main className={styles.page}>
      <section className={styles.intro}>
        <h1 className={styles.title}>dev-side-center</h1>
        <p className={styles.copy}>
          白文字が全面に表示され、スクロールで左右に移動して止まる。
        </p>
      </section>

      <section ref={triggerRef} className={styles.stage}>
        <div className={styles.stickyFrame}>
          <div ref={centerRef} className={styles.centerContent}>
            <h2 className={styles.centerHeading}>konchiwa</h2>
            <div className={styles.centerLine} />
            <img src={heroImage} alt="cat hero" className={styles.centerImage} />
          </div>

          <div ref={leftBlockRef} className={`${styles.wordBlock} ${styles.leftBlock}`}>
            {Array.from({ length: LINE_COUNT }).map((_, i) => (
              <p key={`l-${i}`} className={styles.sideText}>
                <span
                  className={styles.sideTyping}
                  style={{ animationDelay: `${(i % 8) * 0.1}s` }}
                >
                  {WORDS[i % WORDS.length]}
                </span>
              </p>
            ))}
          </div>

          <div ref={rightBlockRef} className={`${styles.wordBlock} ${styles.rightBlock}`}>
            {Array.from({ length: LINE_COUNT }).map((_, i) => (
              <p key={`r-${i}`} className={styles.sideText}>
                <span
                  className={styles.sideTyping}
                  style={{ animationDelay: `${(i % 8) * 0.12}s` }}
                >
                  {WORDS[(i + 2) % WORDS.length]}
                </span>
              </p>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.outro}>
        {Array.from({ length: 3 }).map((_, i) => (
          <p key={i} className={styles.outroText}>
            side locked
          </p>
        ))}
      </section>

      <section className={styles.splitDemoSection}>
        <h3 className={styles.splitDemoTitle}>anime.js splitText HTML template</h3>
        <p ref={splitDemoRef} className={styles.splitTarget}>
          Custom HTML template.
        </p>
      </section>
    </main>
  );
}
