import { animate, createScope, onScroll } from "animejs";
import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "../../lib/usePrefersReducedMotion";
import { ScrollTypingHeading } from "./ScrollTypingHeading";
import styles from "./SideCenterStickySection.module.css";

const LINE_COUNT_DESKTOP = 33;
const LINE_COUNT_MOBILE = 33;
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
  // Hold typing animation instances for pause/resume
  const typingAnimsRef = useRef<ReturnType<typeof animate>[]>([]);
  const progressLoggedRef = useRef(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)");
    setIsMobileViewport(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setIsMobileViewport(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

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
    const lineCount = isMobileViewport ? LINE_COUNT_MOBILE : LINE_COUNT_DESKTOP;
    aboutEl.textContent = "";
    aboutTypedCountRef.current = -1;
    progressLoggedRef.current = false;

    // #region agent log
    fetch("http://127.0.0.1:7935/ingest/62717cfa-0848-4f80-be4f-ac448c9e6877", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Debug-Session-Id": "09b2bb",
      },
      body: JSON.stringify({
        sessionId: "09b2bb",
        runId: "pre-fix",
        hypothesisId: "H1",
        location: "SideCenterStickySection.tsx:effect-entry",
        message: "mobile flags and viewport snapshot",
        data: {
          isMobileViewport,
          innerWidth: window.innerWidth,
          match640: window.matchMedia("(max-width: 640px)").matches,
          lineCount,
          reduceMotion,
        },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion

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

    // #region agent log
    requestAnimationFrame(() => {
      const center = rootRef.current?.querySelector(`.${styles.centerArea}`) as
        | HTMLElement
        | null;
      const sticky = rootRef.current?.querySelector(`.${styles.stickyFrame}`) as
        | HTMLElement
        | null;
      const centerRect = center?.getBoundingClientRect();
      const aboutRect = aboutEl.getBoundingClientRect();
      const leftRect = leftBlock.getBoundingClientRect();
      const rightRect = rightBlock.getBoundingClientRect();
      const probeX = aboutRect.left + aboutRect.width / 2;
      const probeY = aboutRect.top + aboutRect.height / 2;
      const topEl = document.elementFromPoint(probeX, probeY);
      fetch("http://127.0.0.1:7935/ingest/62717cfa-0848-4f80-be4f-ac448c9e6877", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Debug-Session-Id": "09b2bb",
        },
        body: JSON.stringify({
          sessionId: "09b2bb",
          runId: "pre-fix",
          hypothesisId: "H2",
          location: "SideCenterStickySection.tsx:layout-snapshot",
          message: "computed layout and stacking snapshot",
          data: {
            centerZ: center ? getComputedStyle(center).zIndex : null,
            leftZ: getComputedStyle(leftBlock).zIndex,
            rightZ: getComputedStyle(rightBlock).zIndex,
            aboutRect: {
              top: aboutRect.top,
              left: aboutRect.left,
              width: aboutRect.width,
              height: aboutRect.height,
            },
            leftRect: {
              top: leftRect.top,
              left: leftRect.left,
              width: leftRect.width,
              height: leftRect.height,
            },
            rightRect: {
              top: rightRect.top,
              left: rightRect.left,
              width: rightRect.width,
              height: rightRect.height,
            },
            stickyHeight: sticky?.getBoundingClientRect().height ?? null,
            trackMinHeight: getComputedStyle(track).minHeight,
            probeTopElement: topEl
              ? {
                  tagName: topEl.tagName,
                  className: topEl.className,
                }
              : null,
            probePoint: {
              x: probeX,
              y: probeY,
            },
          },
          timestamp: Date.now(),
        }),
      }).catch(() => {});
    });
    // #endregion

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
            if (
              typeof observer.progress === "number" &&
              observer.progress > 0.48 &&
              observer.progress < 0.52 &&
              !progressLoggedRef.current
            ) {
              progressLoggedRef.current = true;
              // #region agent log
              fetch(
                "http://127.0.0.1:7935/ingest/62717cfa-0848-4f80-be4f-ac448c9e6877",
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    "X-Debug-Session-Id": "09b2bb",
                  },
                  body: JSON.stringify({
                    sessionId: "09b2bb",
                    runId: "pre-fix",
                    hypothesisId: "H3",
                    location: "SideCenterStickySection.tsx:on-scroll-midpoint",
                    message: "scroll progress midpoint reached",
                    data: {
                      progress: observer.progress,
                      aboutCharsShown: aboutEl.textContent?.length ?? 0,
                    },
                    timestamp: Date.now(),
                  }),
                },
              ).catch(() => {});
              // #endregion
            }
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
          // #region agent log
          fetch("http://127.0.0.1:7935/ingest/62717cfa-0848-4f80-be4f-ac448c9e6877", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-Debug-Session-Id": "09b2bb",
            },
            body: JSON.stringify({
              sessionId: "09b2bb",
              runId: "pre-fix",
              hypothesisId: "H4",
              location: "SideCenterStickySection.tsx:intersection",
              message: "section intersection state",
              data: {
                isIntersecting: entry.isIntersecting,
                intersectionRatio: entry.intersectionRatio,
              },
              timestamp: Date.now(),
            }),
          }).catch(() => {});
          // #endregion
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
  }, [aboutText, isMobileViewport, reduceMotion]);

  const lineCount = isMobileViewport ? LINE_COUNT_MOBILE : LINE_COUNT_DESKTOP;

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
