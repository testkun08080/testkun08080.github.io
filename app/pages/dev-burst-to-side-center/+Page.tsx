import { useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";
import styles from "./DevBurstToSideCenter.module.css";

const FIRST_WORD = "konchiwa";
const SECOND_WORD = "konchiwa2";
const BG_ROW_TEXT = Array.from({ length: 18 })
  .map(() => "hi there hello oi")
  .join(" ");

const SIDE_WORDS = [
  "hi there h",
  "white words",
  "side center",
  "scroll move",
  "testkun08080",
  "hello world",
] as const;

const SIDE_LINE_COUNT = 36;
const CENTER_MAX_Y = 24;
const TRANSITION_START = 0.45;
const TRANSITION_RANGE = 0.4;

function clamp01(v: number) {
  return Math.max(0, Math.min(1, v));
}

function resolveTypingWord(progress: number) {
  if (progress < 0.45) {
    const typingProgress = clamp01(progress / 0.45);
    const visibleChars = Math.round(FIRST_WORD.length * typingProgress);
    return FIRST_WORD.slice(0, visibleChars);
  }

  if (progress < 0.67) {
    const eraseProgress = clamp01((progress - 0.45) / 0.22);
    const visibleChars = Math.round(FIRST_WORD.length * (1 - eraseProgress));
    return FIRST_WORD.slice(0, visibleChars);
  }

  const retypeProgress = clamp01((progress - 0.67) / 0.33);
  const visibleChars = Math.round(SECOND_WORD.length * retypeProgress);
  return SECOND_WORD.slice(0, visibleChars);
}

function resolveTransitionWord(progress: number) {
  if (progress < 0.2) {
    return FIRST_WORD;
  }

  if (progress < 0.52) {
    const eraseProgress = clamp01((progress - 0.2) / 0.32);
    const visibleChars = Math.round(FIRST_WORD.length * (1 - eraseProgress));
    return FIRST_WORD.slice(0, visibleChars);
  }

  const retypeProgress = clamp01((progress - 0.52) / 0.48);
  const visibleChars = Math.round(SECOND_WORD.length * retypeProgress);
  return SECOND_WORD.slice(0, visibleChars);
}

export default function Page() {
  const reduceMotion = useReducedMotion() ?? false;

  const stageRef = useRef<HTMLElement>(null);
  const bgRowsRef = useRef<(HTMLParagraphElement | null)[]>([]);
  const centerWordRef = useRef<HTMLHeadingElement>(null);
  const centerLineRef = useRef<HTMLDivElement>(null);
  const leftBlockRef = useRef<HTMLDivElement>(null);
  const rightBlockRef = useRef<HTMLDivElement>(null);
  const sideTextRowsRef = useRef<(HTMLParagraphElement | null)[]>([]);

  useEffect(() => {
    const stage = stageRef.current;
    const centerWord = centerWordRef.current;
    const centerLine = centerLineRef.current;
    const left = leftBlockRef.current;
    const right = rightBlockRef.current;
    const sideRows = sideTextRowsRef.current;

    if (!stage || !centerWord || !centerLine || !left || !right) {
      return;
    }

    if (reduceMotion) {
      centerWord.textContent = SECOND_WORD;
      centerLine.style.transform = "scaleX(1)";
      centerLine.style.opacity = "1";
      centerWord.style.opacity = "1";
      centerWord.style.transform = "translateY(0px)";

      bgRowsRef.current.forEach((row) => {
        if (!row) return;
        row.style.opacity = "0";
        row.style.transform = "translateX(0px)";
      });

      left.style.transform = "translate3d(0vw, 0px, 0px)";
      right.style.transform = "translate3d(0vw, 0px, 0px) scaleX(-1)";
      sideRows.forEach((row) => {
        if (!row) return;
        row.style.opacity = "0.88";
      });
      return;
    }

    let rafId = 0;

    const updateStage = () => {
      const rect = stage.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const progress = clamp01((vh - rect.top) / (vh * 2.15));
      const transitionProgress = clamp01(
        (progress - TRANSITION_START) / TRANSITION_RANGE,
      );
      const burstPhase = 1 - transitionProgress;
      const sidePhase = transitionProgress;

      const rows = bgRowsRef.current.filter(Boolean) as HTMLParagraphElement[];
      rows.forEach((row, i) => {
        const rowProgress = clamp01((burstPhase - i * 0.015) * 2.2);
        const direction = i % 2 === 0 ? -1 : 1;
        const offset = (1 - rowProgress) * window.innerWidth * 0.18 * direction;
        row.style.opacity = String((0.08 + rowProgress * 0.82) * (1 - sidePhase));
        row.style.transform = `translateX(${offset}px)`;
      });

      const lineProgress = clamp01((progress - 0.16) / 0.3);
      centerLine.style.transform = `scaleX(${lineProgress})`;
      centerLine.style.opacity = String(clamp01(0.18 + sidePhase * 1.1));

      if (progress < TRANSITION_START) {
        const introWordProgress = clamp01((progress - 0.08) / 0.24);
        centerWord.textContent = resolveTypingWord(introWordProgress);
      } else {
        centerWord.textContent = resolveTransitionWord(transitionProgress);
      }
      centerWord.style.opacity = String(clamp01(0.3 + sidePhase * 0.9));
      centerWord.style.transform = `translateY(${(1 - sidePhase) * CENTER_MAX_Y}px)`;

      left.style.transform = "translate3d(0vw, 0px, 0px)";
      right.style.transform = "translate3d(0vw, 0px, 0px) scaleX(-1)";

      sideRows.forEach((row) => {
        if (!row) return;
        row.style.opacity = String(0.2 + sidePhase * 0.68);
      });
    };

    const onScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = window.requestAnimationFrame(updateStage);
    };

    updateStage();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [reduceMotion]);

  return (
    <main className={styles.page}>
      <section className={styles.intro}>
        <h1 className={styles.title}>dev-burst-to-side-center</h1>
        <p className={styles.copy}>
          スクロールで白テキストと中央ワードが連続的に変形し、1つの演出として推移する確認ページ。
        </p>
      </section>

      <section ref={stageRef} className={styles.stage}>
        <div className={styles.stickyFrame}>
          <div className={styles.burstLayer}>
            {Array.from({ length: 28 }).map((_, i) => (
              <p
                key={`row-${i}`}
                ref={(el) => {
                  bgRowsRef.current[i] = el;
                }}
                className={styles.bgRow}
              >
                {BG_ROW_TEXT}
              </p>
            ))}
          </div>

          <div className={styles.centerLayer}>
            <h2 ref={centerWordRef} className={styles.centerWord}>
              {reduceMotion ? SECOND_WORD : ""}
            </h2>
            <div ref={centerLineRef} className={styles.centerLine} />
          </div>

          <div
            ref={leftBlockRef}
            className={`${styles.wordBlock} ${styles.leftBlock}`}
          >
            {Array.from({ length: SIDE_LINE_COUNT }).map((_, i) => (
              <p
                key={`l-${i}`}
                className={styles.sideText}
                ref={(el) => {
                  sideTextRowsRef.current[i] = el;
                }}
              >
                <span
                  className={styles.sideTyping}
                  style={{ animationDelay: `${(i % 8) * 0.1}s` }}
                >
                  {SIDE_WORDS[i % SIDE_WORDS.length]}
                </span>
              </p>
            ))}
          </div>

          <div
            ref={rightBlockRef}
            className={`${styles.wordBlock} ${styles.rightBlock}`}
          >
            {Array.from({ length: SIDE_LINE_COUNT }).map((_, i) => (
              <p
                key={`r-${i}`}
                className={styles.sideText}
                ref={(el) => {
                  sideTextRowsRef.current[SIDE_LINE_COUNT + i] = el;
                }}
              >
                <span
                  className={styles.sideTyping}
                  style={{ animationDelay: `${(i % 8) * 0.12}s` }}
                >
                  {SIDE_WORDS[(i + 2) % SIDE_WORDS.length]}
                </span>
              </p>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.outro}>
        <p className={styles.outroText}>end of chained animation</p>
      </section>
    </main>
  );
}
