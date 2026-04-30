import { animate, createScope, onScroll } from "animejs";
import { useEffect, useRef, useState } from "react";
import { ScrollTypingHeading } from "./ScrollTypingHeading";
import styles from "./SideCenterStickySection.module.css";

const LINE_COUNT = 33;
const START_OFFSET_VW = 22;

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

type SideCenterStickySectionProps = {
  aboutHeading?: string;
  aboutText: string;
  sideWords?: readonly string[];
};

export function SideCenterStickySection({
  aboutHeading = "About",
  aboutText,
  sideWords = [
    "lookdev pipeline",
    "shader support",
    "creative coding",
    "scroll linked",
    "animejs motion",
    "visual crafting",
  ],
}: SideCenterStickySectionProps) {
  const reduceMotion = usePrefersReducedMotion();
  const rootRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const aboutTextRef = useRef<HTMLParagraphElement>(null);
  const sideTypingSpansRef = useRef<(HTMLSpanElement | null)[]>([]);
  const scopeRef = useRef<ReturnType<typeof createScope> | null>(null);
  const aboutTypedCountRef = useRef(-1);

  useEffect(() => {
    if (
      !rootRef.current ||
      !trackRef.current ||
      !leftRef.current ||
      !rightRef.current ||
      !aboutTextRef.current
    ) {
      return;
    }

    const track = trackRef.current;
    const leftBlock = leftRef.current;
    const rightBlock = rightRef.current;
    const aboutEl = aboutTextRef.current;
    aboutEl.textContent = "";
    aboutTypedCountRef.current = -1;

    const setAboutTypedByProgress = (progress: unknown) => {
      if (typeof progress !== "number") return;
      const clamped = Math.min(Math.max(progress, 0), 1);
      const nextCount = Math.floor(clamped * aboutText.length);
      if (nextCount === aboutTypedCountRef.current) return;
      aboutTypedCountRef.current = nextCount;
      aboutEl.textContent = aboutText.slice(0, nextCount);
    };

    if (reduceMotion) {
      leftBlock.style.transform = "translate3d(0, 0, 0) scaleX(-1)";
      rightBlock.style.transform = "translate3d(0, 0, 0) scaleX(-1)";
      aboutEl.textContent = aboutText;
      sideTypingSpansRef.current.forEach((span) => {
        if (!span) return;
        span.style.width = "100%";
        span.style.borderRightWidth = "0";
      });
      return;
    }

    scopeRef.current = createScope({ root: rootRef.current }).add(() => {
      animate(aboutEl, {
        opacity: [0.26, 1],
        translateY: [18, 0],
        ease: "linear",
        autoplay: onScroll({
          target: track,
          enter: "top+=8% top",
          leave: "bottom-=8% bottom",
          sync: true,
          onUpdate: (self) => {
            const observer = self as { progress?: number };
            setAboutTypedByProgress(observer.progress);
          },
        }),
      });

      animate(leftBlock, {
        translateX: [`${START_OFFSET_VW}vw`, "0vw"],
        ease: "linear",
        autoplay: onScroll({
          target: track,
          enter: "top top",
          leave: "bottom bottom",
          sync: true,
        }),
      });

      animate(rightBlock, {
        translateX: [`-${START_OFFSET_VW}vw`, "0vw"],
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
          i < LINE_COUNT ? (i % 8) * 95 : ((i - LINE_COUNT) % 8) * 120;
        animate(span, {
          width: ["0ch", `${chars}ch`],
          ease: "steps(14)",
          duration: 1100,
          delay: baseDelay,
          loop: true,
          alternate: true,
          loopDelay: 750,
        });
      });
    });

    return () => {
      scopeRef.current?.revert();
      scopeRef.current = null;
      aboutTypedCountRef.current = -1;
    };
  }, [aboutText, reduceMotion]);

  return (
    <section
      ref={rootRef}
      className={styles.stage}
      aria-label="Side center sticky"
    >
      <section ref={trackRef} className={styles.track}>
        <div className={styles.stickyFrame}>
          <div className={styles.centerArea}>
            <ScrollTypingHeading
              text={aboutHeading}
              headingClassName={styles.centerHeading}
              underlineClassName={styles.centerLine}
            />
            <p ref={aboutTextRef} className={styles.aboutText} />
          </div>

          <div
            ref={leftRef}
            className={`${styles.sideBlock} ${styles.leftBlock}`}
          >
            {Array.from({ length: LINE_COUNT }).map((_, i) => (
              <p key={`l-${i}`} className={styles.sideText}>
                <span
                  className={styles.sideTyping}
                  ref={(el) => {
                    sideTypingSpansRef.current[i] = el;
                  }}
                >
                  {sideWords[i % sideWords.length]}
                </span>
              </p>
            ))}
          </div>

          <div
            ref={rightRef}
            className={`${styles.sideBlock} ${styles.rightBlock}`}
          >
            {Array.from({ length: LINE_COUNT }).map((_, i) => (
              <p key={`r-${i}`} className={styles.sideText}>
                <span
                  className={styles.sideTyping}
                  ref={(el) => {
                    sideTypingSpansRef.current[LINE_COUNT + i] = el;
                  }}
                >
                  {sideWords[i % sideWords.length]}
                </span>
              </p>
            ))}
          </div>
        </div>
      </section>
    </section>
  );
}
