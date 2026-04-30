import { animate, createScope, onScroll } from "animejs";
import { useEffect, useRef } from "react";
import styles from "./DevSideCenterSticky.module.css";

const WORDS = [
  "lookdev pipeline",
  "shader support",
  "creative coding",
  "scroll linked",
  "animejs motion",
  "visual crafting",
] as const;

const FIRST_TEXT = "NICE TO MEET YOU";
const SECOND_TEXT = "I BUILD ART WITH CODE";
const THIRD_TEXT = "LET'S CREATE TOGETHER";
const LINE_COUNT = 36;
const START_OFFSET_VW = 24;

export default function Page() {
  const rootRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLElement>(null);
  const thirdSectionRef = useRef<HTMLElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const centerWordRef = useRef<HTMLHeadingElement>(null);
  const thirdWordRef = useRef<HTMLHeadingElement>(null);
  const sideTypingSpansRef = useRef<(HTMLSpanElement | null)[]>([]);
  const scopeRef = useRef<ReturnType<typeof createScope> | null>(null);
  const centerTypedCountRef = useRef(-1);
  const thirdTypedCountRef = useRef(-1);

  useEffect(() => {
    if (
      !rootRef.current ||
      !trackRef.current ||
      !leftRef.current ||
      !rightRef.current ||
      !centerWordRef.current ||
      !thirdSectionRef.current ||
      !thirdWordRef.current
    ) {
      return;
    }

    const track = trackRef.current;
    const thirdSection = thirdSectionRef.current;
    const leftBlock = leftRef.current;
    const rightBlock = rightRef.current;
    const centerWord = centerWordRef.current;
    const thirdWord = thirdWordRef.current;
    centerWord.textContent = "";
    thirdWord.textContent = THIRD_TEXT;
    centerTypedCountRef.current = -1;
    thirdTypedCountRef.current = -1;

    const setCenterTypedByProgress = (progress: unknown) => {
      if (typeof progress !== "number") return;
      const clamped = Math.min(Math.max(progress, 0), 1);
      const phaseSplit = 0.52;
      if (clamped < phaseSplit) {
        const phaseProgress = clamped / phaseSplit;
        const nextCount = Math.floor(phaseProgress * FIRST_TEXT.length);
        if (nextCount === centerTypedCountRef.current) return;
        centerTypedCountRef.current = nextCount;
        centerWord.textContent = FIRST_TEXT.slice(0, nextCount);
        return;
      }
      const phaseProgress = (clamped - phaseSplit) / (1 - phaseSplit);
      const nextCount = Math.floor(phaseProgress * SECOND_TEXT.length);
      const phaseCount = FIRST_TEXT.length + nextCount;
      if (phaseCount === centerTypedCountRef.current) return;
      centerTypedCountRef.current = phaseCount;
      centerWord.textContent = SECOND_TEXT.slice(0, nextCount);
    };

    const setThirdTypedByProgress = (progress: unknown) => {
      if (typeof progress !== "number") return;
      const clamped = Math.min(Math.max(progress, 0), 1);
      const nextCount = Math.floor(clamped * THIRD_TEXT.length);
      if (nextCount === thirdTypedCountRef.current) return;
      thirdTypedCountRef.current = nextCount;
      thirdWord.textContent = THIRD_TEXT.slice(0, nextCount);
    };

    scopeRef.current = createScope({ root: rootRef.current }).add(() => {
      animate(centerWord, {
        opacity: [0.3, 1],
        scale: [0.88, 1],
        letterSpacing: ["0.02em", "0.12em"],
        ease: "linear",
        autoplay: onScroll({
          target: track,
          enter: "top+=10% top",
          leave: "bottom-=10% bottom",
          sync: true,
          onUpdate: (self) => {
            const observer = self as { progress?: number };
            setCenterTypedByProgress(observer.progress);
          },
        }),
      });

      animate(leftBlock, {
        translateX: ["0vw", `${START_OFFSET_VW}vw`],
        ease: "linear",
        autoplay: onScroll({
          target: track,
          enter: "top top",
          leave: "bottom bottom",
          sync: true,
        }),
      });

      animate(rightBlock, {
        translateX: ["0vw", `-${START_OFFSET_VW}vw`],
        scaleX: [-1, -1],
        ease: "linear",
        autoplay: onScroll({
          target: track,
          enter: "top top",
          leave: "bottom bottom",
          sync: true,
        }),
      });

      sideTypingSpansRef.current.forEach((span, i) => {
        if (!span) return;
        const chars = (span.textContent?.length ?? 12) + 1;
        const baseDelay =
          i < LINE_COUNT ? (i % 8) * 100 : ((i - LINE_COUNT) % 8) * 120;
        animate(span, {
          width: [`0ch`, `${chars}ch`],
          ease: "steps(14)",
          duration: 1100,
          delay: baseDelay,
          loop: true,
          alternate: true,
          loopDelay: 750,
        });
      });

      animate(thirdWord, {
        opacity: [0.2, 1],
        translateY: [28, 0],
        scale: [0.96, 1],
        letterSpacing: ["0.03em", "0.1em"],
        ease: "linear",
        autoplay: onScroll({
          target: thirdSection,
          enter: "top bottom",
          leave: "bottom top",
          sync: true,
          onUpdate: (self) => {
            const observer = self as { progress?: number };
            setThirdTypedByProgress(observer.progress);
          },
        }),
      });
    });

    return () => {
      scopeRef.current?.revert();
      scopeRef.current = null;
      centerWord.textContent = SECOND_TEXT;
      thirdWord.textContent = THIRD_TEXT;
      centerTypedCountRef.current = -1;
      thirdTypedCountRef.current = -1;
    };
  }, []);

  return (
    <main ref={rootRef} className={styles.page}>
      <section className={styles.intro}>
        <h1 className={styles.title}>dev-side-center-sticky</h1>
        <p className={styles.copy}>
          スクロール中だけ中央テキストを sticky
          固定して、進捗に合わせて文字を出します。
        </p>
      </section>

      <section ref={trackRef} className={styles.track}>
        <div className={styles.stickyFrame}>
          <div className={styles.centerArea}>
            <h2 ref={centerWordRef} className={styles.centerText}>
              {FIRST_TEXT}
            </h2>
            <div className={styles.centerLine} />
          </div>

          <div ref={leftRef} className={`${styles.sideBlock} ${styles.leftBlock}`}>
            {Array.from({ length: LINE_COUNT }).map((_, i) => (
              <p key={`l-${i}`} className={styles.sideText}>
                <span
                  className={styles.sideTyping}
                  ref={(el) => {
                    sideTypingSpansRef.current[i] = el;
                  }}
                >
                  {WORDS[i % WORDS.length]}
                </span>
              </p>
            ))}
          </div>

          <div ref={rightRef} className={`${styles.sideBlock} ${styles.rightBlock}`}>
            {Array.from({ length: LINE_COUNT }).map((_, i) => (
              <p key={`r-${i}`} className={styles.sideText}>
                <span
                  className={styles.sideTyping}
                  ref={(el) => {
                    sideTypingSpansRef.current[LINE_COUNT + i] = el;
                  }}
                >
                  {WORDS[i % WORDS.length]}
                </span>
              </p>
            ))}
          </div>
        </div>
      </section>

      <section ref={thirdSectionRef} className={styles.thirdStage}>
        <h3 ref={thirdWordRef} className={styles.thirdText}>
          {THIRD_TEXT}
        </h3>
      </section>

      <section className={styles.outro}>
        <p>Scroll demo end.</p>
      </section>
    </main>
  );
}
