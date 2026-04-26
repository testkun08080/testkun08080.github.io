import { animate, createTimeline } from "animejs";
import { useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";
import styles from "./DevRandomFlow.module.css";

const RANDOM_CHARS = "abcdefghijklmnopqrstuvwxyz0123456789";

function scrambleFrame(target: string, progress: number) {
  const revealCount = Math.floor(target.length * progress);
  return target
    .split("")
    .map((char, index) => {
      if (char === " ") return " ";
      if (index < revealCount) return target[index];
      return RANDOM_CHARS[Math.floor(Math.random() * RANDOM_CHARS.length)] ?? "x";
    })
    .join("");
}

function animateScramble(el: HTMLElement, text: string, duration: number) {
  const state = { progress: 0 };
  el.textContent = "";
  return animate(state, {
    progress: 1,
    duration,
    ease: "linear",
    onUpdate: () => {
      el.textContent = scrambleFrame(text, state.progress);
    },
    onComplete: () => {
      el.textContent = text;
    },
  });
}

export default function Page() {
  const reduceMotion = useReducedMotion() ?? false;
  const triggerRef = useRef<HTMLElement>(null);
  const topLinesRef = useRef<(HTMLParagraphElement | null)[]>([]);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const centerRef = useRef<HTMLHeadingElement>(null);
  const sideLeftRef = useRef<HTMLParagraphElement>(null);
  const sideRightRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const triggerEl = triggerRef.current;
    if (!triggerEl || reduceMotion) return;

    let started = false;
    let disposers: Array<() => void> = [];

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting || started) return;
        started = true;

        const lineEls = topLinesRef.current.filter(Boolean) as HTMLParagraphElement[];
        const headingEl = headingRef.current;
        const centerEl = centerRef.current;
        const sideLeftEl = sideLeftRef.current;
        const sideRightEl = sideRightRef.current;
        if (!headingEl || !centerEl || !sideLeftEl || !sideRightEl) return;

        const tl = createTimeline({ defaults: { ease: "out(3)" } });
        tl.add(lineEls, {
          opacity: [0, 1],
          translateY: [-24, 0],
          duration: 520,
          delay: (_, i) => i * 90,
        });
        tl.add(sideLeftEl, {
          opacity: [0, 1],
          translateX: [-120, 0],
          duration: 620,
        });
        tl.add(sideRightEl, {
          opacity: [0, 1],
          translateX: [120, 0],
          duration: 620,
          at: "<",
        });
        tl.play();

        const a1 = animateScramble(headingEl, "testtestesttestesttest", 1200);
        const a2 = animateScramble(centerEl, "test", 1000);
        disposers = [() => tl.revert(), () => a1.revert(), () => a2.revert()];
        observer.disconnect();
      },
      { threshold: 0.38 },
    );

    observer.observe(triggerEl);
    return () => {
      observer.disconnect();
      disposers.forEach((dispose) => dispose());
    };
  }, [reduceMotion]);

  return (
    <main className={styles.page}>
      <section className={styles.intro}>
        <h1 className={styles.introTitle}>dev-random-flow</h1>
        <p className={styles.introText}>
          スクロールすると、ランダムな文字からテキストがタイピング確定される。
        </p>
      </section>

      <section ref={triggerRef} className={styles.stage}>
        <div className={styles.stackTop}>
          {Array.from({ length: 6 }).map((_, i) => (
            <p
              key={`line-${i}`}
              ref={(el) => {
                topLinesRef.current[i] = el;
              }}
              className={styles.noiseLine}
            >
              testtesttesttesttesttesttesttesttesttesttesttesttesttesttesttest
            </p>
          ))}
        </div>

        <h2 ref={headingRef} className={styles.largeHeading}>
          {reduceMotion ? "testtestesttestesttest" : ""}
        </h2>

        <div className={styles.centerRow}>
          <p ref={sideLeftRef} className={styles.sideLine}>
            testtesttesttesttesttest
          </p>
          <h3 ref={centerRef} className={styles.centerWord}>
            {reduceMotion ? "test" : ""}
          </h3>
          <p ref={sideRightRef} className={styles.sideLine}>
            testtesttesttesttesttest
          </p>
        </div>
      </section>
    </main>
  );
}
