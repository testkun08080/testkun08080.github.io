import { animate, createScope, onScroll } from "animejs";
import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import {
  createScrollRunOnceLatch,
  handleScrollRunOnceUpdate,
} from "../../lib/scrollRunOnce";
import { usePrefersReducedMotion } from "../../lib/usePrefersReducedMotion";
import { ScrollTypingHeading } from "./ScrollTypingHeading";
import styles from "./SideCenterStickySection.module.css";

const INITIAL_LINE_COUNT = 33;
const START_OFFSET_VW = 22;
const SCROLL_IDLE_MS = 140;

type SideCenterStickySectionProps = {
  aboutHeading?: string;
  aboutText: string;
  sideWords?: readonly string[];
  children?: ReactNode;
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
  children,
}: SideCenterStickySectionProps) {
  const reduceMotion = usePrefersReducedMotion();
  const rootRef = useRef<HTMLElement>(null);
  const aboutTrackRef = useRef<HTMLDivElement>(null);
  const stickyFrameRef = useRef<HTMLDivElement>(null);
  const centerAreaRef = useRef<HTMLDivElement>(null);
  const aboutTextRef = useRef<HTMLParagraphElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const sideTypingSpansRef = useRef<(HTMLSpanElement | null)[]>([]);
  const scopeRef = useRef<ReturnType<typeof createScope> | null>(null);
  const [isMobileViewport, setIsMobileViewport] = useState(() =>
    typeof window !== "undefined"
      ? window.matchMedia("(max-width: 640px)").matches
      : false,
  );
  const [lineCount, setLineCount] = useState(INITIAL_LINE_COUNT);
  // Hold typing animation instances for pause/resume
  const typingAnimsRef = useRef<ReturnType<typeof animate>[]>([]);
  const sectionVisibleRef = useRef(false);
  const scrollIdleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)");
    setIsMobileViewport(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setIsMobileViewport(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    let rafId = 0;
    let debounceId: ReturnType<typeof setTimeout> | null = null;
    const updateLineCount = () => {
      const stickyFrame = stickyFrameRef.current;
      const leftBlock = leftRef.current;
      if (!stickyFrame || !leftBlock) return;
      const sampleRow = leftBlock.querySelector(
        `.${styles.sideText}`,
      ) as HTMLParagraphElement | null;
      const sampleHeight = sampleRow?.getBoundingClientRect().height ?? 0;
      if (sampleHeight <= 0) return;
      const blockStyles = window.getComputedStyle(leftBlock);
      const gap =
        Number.parseFloat(blockStyles.rowGap || blockStyles.gap || "0") || 0;
      const rowPitch = sampleHeight + gap;
      const frameHeight =
        stickyFrame.getBoundingClientRect().height || window.innerHeight;
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

    const debouncedSchedule = () => {
      if (debounceId) clearTimeout(debounceId);
      debounceId = setTimeout(scheduleUpdate, 180);
    };

    scheduleUpdate();
    window.addEventListener("resize", debouncedSchedule);
    window.addEventListener("orientationchange", debouncedSchedule);
    return () => {
      cancelAnimationFrame(rafId);
      if (debounceId) clearTimeout(debounceId);
      window.removeEventListener("resize", debouncedSchedule);
      window.removeEventListener("orientationchange", debouncedSchedule);
    };
  }, [isMobileViewport]);

  useEffect(() => {
    if (
      !rootRef.current ||
      !leftRef.current ||
      !rightRef.current ||
      !centerAreaRef.current ||
      !aboutTextRef.current
    ) {
      return;
    }

    const stage = rootRef.current;
    const leftBlock = leftRef.current;
    const rightBlock = rightRef.current;
    const centerArea = centerAreaRef.current;
    const aboutTextEl = aboutTextRef.current;
    sideTypingSpansRef.current = sideTypingSpansRef.current.slice(
      0,
      lineCount * 2,
    );

    if (reduceMotion) {
      leftBlock.style.transform = "translate3d(0, 0, 0) scaleX(-1)";
      rightBlock.style.transform = "translate3d(0, 0, 0) scaleX(-1)";
      centerArea.style.opacity = "1";
      aboutTextEl.style.opacity = "1";
      aboutTextEl.style.transform = "translateY(0px)";
      sideTypingSpansRef.current.forEach((span) => {
        if (!span) return;
        span.style.width = "100%";
        span.style.borderRightWidth = "0";
      });
      return;
    }

    scopeRef.current = createScope({ root: rootRef.current }).add(() => {
      const sideLatch = createScrollRunOnceLatch();
      const aboutLatch = createScrollRunOnceLatch();
      let leftAnim: ReturnType<typeof animate> | null = null;
      let rightAnim: ReturnType<typeof animate> | null = null;
      let aboutAnim: ReturnType<typeof animate> | null = null;

      const latchSideColumns = (self: unknown) => {
        handleScrollRunOnceUpdate(sideLatch, self, () => {
          leftAnim?.revert();
          rightAnim?.revert();
          leftAnim = null;
          rightAnim = null;
          leftBlock.style.transform = "translate3d(0, 0, 0) scaleX(-1)";
          rightBlock.style.transform = "translate3d(0, 0, 0) scaleX(-1)";
        });
        if (sideLatch.completed) {
          leftBlock.style.transform = "translate3d(0, 0, 0) scaleX(-1)";
          rightBlock.style.transform = "translate3d(0, 0, 0) scaleX(-1)";
        }
      };

      const latchAboutText = (self: unknown) => {
        handleScrollRunOnceUpdate(aboutLatch, self, () => {
          aboutAnim?.revert();
          aboutAnim = null;
          aboutTextEl.style.opacity = "1";
          aboutTextEl.style.transform = "translateY(0px)";
        });
        if (aboutLatch.completed) {
          aboutTextEl.style.opacity = "1";
          aboutTextEl.style.transform = "translateY(0px)";
        }
      };

      // Side typing blocks slide-in and stay visible across the entire stage
      // (covers about, work, skills, contact, footer)
      leftAnim = animate(leftBlock, {
        translateX: [`${START_OFFSET_VW}vw`, "0vw"],
        ease: "linear",
        autoplay: onScroll({
          target: stage,
          enter: "top top",
          leave: "bottom bottom",
          sync: true,
          onUpdate: latchSideColumns,
        }),
      });

      rightAnim = animate(rightBlock, {
        translateX: [`-${START_OFFSET_VW}vw`, "0vw"],
        scaleX: [-1, -1],
        ease: "linear",
        autoplay: onScroll({
          target: stage,
          enter: "top top",
          leave: "bottom bottom",
          sync: true,
          onUpdate: latchSideColumns,
        }),
      });

      aboutAnim = animate(aboutTextEl, {
        opacity: [0, 1],
        translateY: ["40px", "0px"],
        autoplay: onScroll({
          enter: "bottom top",
          leave: "top center",
          sync: true,
          onUpdate: latchAboutText,
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
    const setTypingPlayback = (playing: boolean) => {
      for (const anim of typingAnimsRef.current) {
        if (playing) anim.play();
        else anim.pause();
      }
    };

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          sectionVisibleRef.current = entry.isIntersecting;
          if (entry.isIntersecting) {
            setTypingPlayback(true);
          } else {
            setTypingPlayback(false);
          }
        }
      },
      { threshold: 0 },
    );
    if (rootRef.current) io.observe(rootRef.current);

    const handleWindowScroll = () => {
      if (sectionVisibleRef.current) {
        if (scrollIdleTimerRef.current) {
          clearTimeout(scrollIdleTimerRef.current);
          scrollIdleTimerRef.current = null;
        }
        setTypingPlayback(true);
        return;
      }

      setTypingPlayback(false);
      if (scrollIdleTimerRef.current) {
        clearTimeout(scrollIdleTimerRef.current);
      }
      scrollIdleTimerRef.current = setTimeout(() => {
        scrollIdleTimerRef.current = null;
        if (sectionVisibleRef.current) {
          setTypingPlayback(true);
        }
      }, SCROLL_IDLE_MS);
    };
    window.addEventListener("scroll", handleWindowScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleWindowScroll);
      if (scrollIdleTimerRef.current) {
        clearTimeout(scrollIdleTimerRef.current);
      }
      io.disconnect();
      scopeRef.current?.revert();
      scopeRef.current = null;
      typingAnimsRef.current = [];
    };
  }, [lineCount, reduceMotion]);

  return (
    <section
      ref={rootRef}
      className={styles.stage}
      aria-label="Side center sticky"
    >
      {/* Side typing background: pinned through the whole stage (about + children) */}
      <div
        ref={stickyFrameRef}
        className={styles.stickyFrame}
        aria-hidden="true"
      >
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

      {/* About: pinned only during the aboutTrack span */}
      <div ref={aboutTrackRef} className={styles.aboutTrack}>
        <div className={styles.centerSticky}>
          <div ref={centerAreaRef} className={styles.centerArea}>
            <ScrollTypingHeading
              text={aboutHeading}
              headingClassName={styles.centerHeading}
              underlineClassName={styles.centerLine}
            />
            <p ref={aboutTextRef} className={styles.aboutText}>
              {aboutText}
            </p>
          </div>
        </div>
      </div>

      {children}
    </section>
  );
}
