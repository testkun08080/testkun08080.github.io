import { animate, createScope, onScroll } from "animejs";
import { useEffect, useRef, useState } from "react";
import { ScrollTypingHeading } from "./ScrollTypingHeading";
import styles from "../../pages/dev-side-center-anime/DevSideCenterAnime.module.css";

const WORDS = [
  "hi there h",
  "white words",
  "side center",
  "scroll move",
  "testkun08080",
  "hello world",
] as const;

const LINE_COUNT = 36;
const START_OFFSET_VW = 33;

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

type AboutStickySectionProps = {
  aboutText: string;
};

export function AboutStickySection({ aboutText }: AboutStickySectionProps) {
  const reduceMotion = usePrefersReducedMotion();
  const rootRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const centerRef = useRef<HTMLDivElement>(null);
  const sideTypingSpansRef = useRef<(HTMLSpanElement | null)[]>([]);
  const aboutTextRef = useRef<HTMLParagraphElement>(null);
  const scopeRef = useRef<ReturnType<typeof createScope> | null>(null);
  const typeCountRef = useRef(0);

  useEffect(() => {
    if (!rootRef.current) return;
    const track = trackRef.current;
    const left = leftRef.current;
    const right = rightRef.current;
    const center = centerRef.current;
    const aboutEl = aboutTextRef.current;
    if (!aboutEl) return;

    // If the sticky track is temporarily disabled, keep About text visible.
    if (!track || !left || !right || !center) {
      aboutEl.textContent = aboutText;
      return;
    }

    if (reduceMotion) {
      left.style.transform = "translate3d(0, 0, 0)";
      right.style.transform = "translate3d(0, 0, 0)";
      center.style.opacity = "1";
      center.style.transform = "translateY(0)";
      aboutEl.textContent = aboutText;
      sideTypingSpansRef.current.forEach((span) => {
        if (!span) return;
        span.style.width = "100%";
        span.style.borderRightWidth = "0";
      });
      return;
    }

    scopeRef.current = createScope({ root: rootRef.current }).add(() => {
      const sideChars = sideTypingSpansRef.current.map(
        (span) => (span?.textContent?.length ?? 12) + 1,
      );

      animate(left, {
        translateX: [`${START_OFFSET_VW}vw`, "0vw"],
        ease: "linear",
        autoplay: onScroll({
          target: track,
          enter: "bottom top",
          leave: "center top",
          sync: true,
        }),
      });

      animate(right, {
        translateX: [`-${START_OFFSET_VW}vw`, "0vw"],
        scaleX: [-1, -1],
        ease: "linear",
        autoplay: onScroll({
          target: track,
          enter: "bottom top",
          leave: "center top",
          sync: true,
        }),
      });

      animate(center, {
        opacity: [0.28, 1],
        translateY: [14, 0],
        ease: "linear",
        autoplay: onScroll({
          target: track,
          enter: "top+=20% top",
          leave: "top+=72% top",
          sync: true,
        }),
      });

      animate(aboutEl, {
        autoplay: onScroll({
          target: track,
          sync: true,
          debug: true,
          onUpdate: (self) => {
            const observer = self as { progress?: number };
            if (typeof observer.progress !== "number") return;
            const clamped = Math.min(Math.max(observer.progress, 0), 1);
            const nextCount = Math.floor(clamped * aboutText.length);
            if (nextCount === typeCountRef.current) return;
            typeCountRef.current = nextCount;
            aboutEl.textContent = aboutText.slice(0, nextCount);
          },
        }),
      });

      animate(track, {
        opacity: [0, 1],
        autoplay: onScroll({
          target: track,
          enter: "top+=8% top",
          leave: "top+=84% top",
          sync: true,
          onUpdate: (self) => {
            const observer = self as { progress?: number };
            if (typeof observer.progress !== "number") return;
            const clamped = Math.min(Math.max(observer.progress, 0), 1);

            sideTypingSpansRef.current.forEach((span, i) => {
              if (!span) return;
              const phaseOffset =
                i < LINE_COUNT ? (i % 8) * 0.04 : ((i - LINE_COUNT) % 8) * 0.04;
              const phaseProgress = Math.min(
                Math.max((clamped - phaseOffset) / 0.65, 0),
                1,
              );
              const width = Math.max(
                Math.floor(phaseProgress * sideChars[i]),
                1,
              );
              span.style.width = `${width}ch`;
              span.style.borderRightWidth = phaseProgress >= 1 ? "0" : "2px";
            });
          },
        }),
      });
    });

    return () => {
      scopeRef.current?.revert();
      scopeRef.current = null;
      typeCountRef.current = 0;
      aboutEl.textContent = "";
    };
  }, [aboutText, reduceMotion]);

  return (
    <main
      ref={rootRef}
      className={styles.page}
      style={{
        paddingInline: "43px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        gap: "56px",
      }}
    >
      <ScrollTypingHeading
        text="About"
        headingClassName={styles.centerHeading}
        underlineClassName={styles.centerLine}
      />
      <p
        ref={aboutTextRef}
        className={styles.outroText}
        style={{
          width: "min(86vw, 980px)",
          textAlign: "center",
          marginInline: "auto",
          whiteSpace: "pre-line",
          lineHeight: 2.3,
          color: "var(--color-anime-about-text)",
          fontSize: "clamp(0.98rem, 1.55vw, 1.16rem)",
          opacity: 1,
        }}
      />
      {/* <section ref={trackRef} className={styles.track}>
        <div className={styles.stickyFrame}>
          <div ref={centerRef} className={styles.centerContent}>
            <ScrollTypingHeading
              text="About"
              headingClassName={styles.centerHeading}
              underlineClassName={styles.centerLine}
            />
            <p
              ref={aboutTextRef}
              className={styles.outroText}
              style={{
                width: "min(86vw, 980px)",
                textAlign: "center",
                marginInline: "auto",
                whiteSpace: "pre-line",
                lineHeight: 1.55,
                color: "var(--color-anime-about-text)",
                fontSize: "clamp(0.98rem, 1.55vw, 1.16rem)",
              }}
            />
          </div>

          <div
            ref={leftRef}
            className={`${styles.wordBlock} ${styles.leftBlock}`}
          >
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

          <div
            ref={rightRef}
            className={`${styles.wordBlock} ${styles.rightBlock}`}
          >
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
      </section> */}
    </main>
  );
}
