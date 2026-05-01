import { animate, createScope, onScroll } from "animejs";
import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "../../lib/usePrefersReducedMotion";
import { ScrollTypingHeading } from "./ScrollTypingHeading";
import styles from "./SideCenterStickySection.module.css";

const INITIAL_LINE_COUNT = 33;
const START_OFFSET_VW = 22;

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
  const stickyFrameRef = useRef<HTMLDivElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const aboutTextRef = useRef<HTMLParagraphElement>(null);
  const sideTypingSpansRef = useRef<(HTMLSpanElement | null)[]>([]);
  const scopeRef = useRef<ReturnType<typeof createScope> | null>(null);
  const aboutTypedCountRef = useRef(-1);
  const [isMobileViewport, setIsMobileViewport] = useState(
    () =>
      typeof window !== "undefined"
        ? window.matchMedia("(max-width: 640px)").matches
        : false,
  );
  const [lineCount, setLineCount] = useState(INITIAL_LINE_COUNT);
  // Hold typing animation instances for pause/resume
  const typingAnimsRef = useRef<ReturnType<typeof animate>[]>([]);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)");
    setIsMobileViewport(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setIsMobileViewport(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    let rafId = 0;
    const updateLineCount = () => {
      const stickyFrame = stickyFrameRef.current;
      const leftBlock = leftRef.current;
      if (!stickyFrame || !leftBlock) return;
      const sampleRow = leftBlock.querySelector(`.${styles.sideText}`) as HTMLParagraphElement | null;
      const sampleHeight = sampleRow?.getBoundingClientRect().height ?? 0;
      if (sampleHeight <= 0) return;
      const blockStyles = window.getComputedStyle(leftBlock);
      const gap = Number.parseFloat(blockStyles.rowGap || blockStyles.gap || "0") || 0;
      const rowPitch = sampleHeight + gap;
      const frameHeight = stickyFrame.getBoundingClientRect().height || window.innerHeight;
      const buffer = isMobileViewport ? 2 : 1;
      const minRows = isMobileViewport ? 34 : 24;
      const maxRows = isMobileViewport ? 56 : 44;
      const desired = Math.ceil(frameHeight / rowPitch) + buffer;
      const nextCount = Math.min(maxRows, Math.max(minRows, desired));
      setLineCount((prev) => (prev === nextCount ? prev : nextCount));
    };

    const scheduleUpdate = () => {
      cancelAnimationFrame(rafId);
      rafId = window.requestAnimationFrame(updateLineCount);
    };

    scheduleUpdate();
    window.addEventListener("resize", scheduleUpdate);
    window.addEventListener("orientationchange", scheduleUpdate);
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", scheduleUpdate);
      window.removeEventListener("orientationchange", scheduleUpdate);
    };
  }, [isMobileViewport]);

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
    sideTypingSpansRef.current = sideTypingSpansRef.current.slice(0, lineCount * 2);

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

      // Store typing animations for IntersectionObserver pause/resume
      typingAnimsRef.current = [];
      sideTypingSpansRef.current.forEach((span, i) => {
        if (!span) return;
        const chars = (span.textContent?.length ?? 12) + 1;
        const baseDelay =
          i < lineCount ? (i % 8) * 95 : ((i - lineCount) % 8) * 120;
        const anim = animate(span, {
          width: ["0ch", `${chars}ch`],
          ease: "steps(14)",
          duration: 1100,
          delay: baseDelay,
          loop: true,
          alternate: true,
          loopDelay: 750,
        });
        typingAnimsRef.current.push(anim);
      });
    });

    // Pause loop animations when section is not visible
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          for (const anim of typingAnimsRef.current) {
            if (entry.isIntersecting) {
              anim.play();
            } else {
              anim.pause();
            }
          }
        }
      },
      { threshold: 0 },
    );
    if (rootRef.current) io.observe(rootRef.current);

    return () => {
      io.disconnect();
      scopeRef.current?.revert();
      scopeRef.current = null;
      typingAnimsRef.current = [];
      aboutTypedCountRef.current = -1;
    };
  }, [aboutText, lineCount, reduceMotion]);

  return (
    <section
      ref={rootRef}
      className={styles.stage}
      aria-label="Side center sticky"
    >
      <section ref={trackRef} className={styles.track}>
        <div ref={stickyFrameRef} className={styles.stickyFrame}>
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
            {Array.from({ length: lineCount }).map((_, i) => (
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
            {Array.from({ length: lineCount }).map((_, i) => (
              <p key={`r-${i}`} className={styles.sideText}>
                <span
                  className={styles.sideTyping}
                  ref={(el) => {
                    sideTypingSpansRef.current[lineCount + i] = el;
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
