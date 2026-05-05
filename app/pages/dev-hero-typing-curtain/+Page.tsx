import { useEffect, useRef, useState, type CSSProperties } from "react";
import { HeroBurstLogoSection } from "../../components/dev-integrated/HeroBurstLogoSection";
import { SideCenterStickySection } from "../../components/dev-integrated/SideCenterStickySection";
import { ScrollTypingHeading } from "../../components/dev-integrated/ScrollTypingHeading";
import { productionHomeCopy } from "../../lib/translations";
import styles from "./DevHeroTypingCurtain.module.css";

const INITIAL_LINE_COUNT = 16;
const REPEAT_N = 15;
const CLOSE_BASE = 6;
const CLOSE_STEP = 1.9;
const OPEN_BASE = 36;
const OPEN_STEP = 0.9;
const PHASE_SPAN = 14;
const BRIDGE_TYPING_START = 0.35;
const BRIDGE_TYPING_END = 0.75;

const ja = productionHomeCopy.ja;
const CURTAIN_LINE = Array.from(
  { length: REPEAT_N },
  () => ja.greetingBgRowText,
).join(" ");

export default function Page() {
  const measureRowRef = useRef<HTMLParagraphElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const bridgeScrollProgressRef = useRef(0);
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
      const viewportHeight = window.innerHeight;
      const desired = Math.ceil(viewportHeight / rowHeight) + buffer;
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

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const updateProgress = () => {
      const scrollY = window.scrollY;
      const trackTop = track.getBoundingClientRect().top + scrollY;
      const range = track.offsetHeight - window.innerHeight;
      const p =
        range > 0 ? Math.min(Math.max((scrollY - trackTop) / range, 0), 1) : 0;
      bridgeScrollProgressRef.current = p;
    };

    let rafId = 0;
    const schedule = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(updateProgress);
    };

    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });

    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <main>
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
                className={`${styles.layer} ${styles.layerA}`}
                aria-hidden={false}
              >
                <HeroBurstLogoSection
                  bridgeScrollProgressRef={bridgeScrollProgressRef}
                />
              </section>

              <section
                className={`${styles.layer} ${styles.layerB}`}
                aria-hidden={true}
              >
                <ScrollTypingHeading
                  text="こんにちわ"
                  headingClassName={styles.typingWord}
                  underlineClassName={styles.typingUnderline}
                  bridgeScrollProgressRef={bridgeScrollProgressRef}
                  bridgeTypingRevealStart={BRIDGE_TYPING_START}
                  bridgeTypingRevealEnd={BRIDGE_TYPING_END}
                />
              </section>

              <div className={styles.curtain} aria-hidden="true">
                {Array.from({ length: lineCount }, (_, i) => {
                  const edgeDistance = Math.min(i, lineCount - 1 - i);
                  const reverseDistance = Math.max(i, lineCount - 1 - i);
                  const closeStart = CLOSE_BASE + edgeDistance * CLOSE_STEP;
                  const closeEnd = closeStart + PHASE_SPAN;
                  const openStart = OPEN_BASE + reverseDistance * OPEN_STEP;
                  const openEnd = openStart + PHASE_SPAN;
                  const lineClass =
                    i % 2 === 0 ? styles.curtainLine : styles.curtainLineAlt;
                  const base = styles.marqueeTrack;
                  const trackLeft =
                    i % 2 === 0
                      ? `${base} ${styles.marqueeLeft}`
                      : `${base} ${styles.marqueeRight}`;
                  const trackRight =
                    i % 2 === 0
                      ? `${base} ${styles.marqueeRight}`
                      : `${base} ${styles.marqueeLeft}`;
                  const durationSec = 124 + ((i * 7) % 6) * 8;
                  const marqueeStyle = {
                    ["--marquee-duration" as string]: `${durationSec}s`,
                  } as CSSProperties;
                  return (
                    <div key={i} className={styles.row}>
                      <div
                        className={`${styles.half} ${styles.halfLeft}`}
                        style={
                          {
                            "--close-start": `${closeStart}%`,
                            "--close-end": `${closeEnd}%`,
                            "--open-start": `${openStart}%`,
                            "--open-end": `${openEnd}%`,
                          } as CSSProperties
                        }
                      >
                        <div className={styles.halfClip}>
                          <div className={trackLeft} style={marqueeStyle}>
                            <p className={lineClass} aria-hidden>
                              {CURTAIN_LINE}
                            </p>
                            <p className={lineClass} aria-hidden>
                              {CURTAIN_LINE}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div
                        className={`${styles.half} ${styles.halfRight}`}
                        style={
                          {
                            "--close-start": `${closeStart}%`,
                            "--close-end": `${closeEnd}%`,
                            "--open-start": `${openStart}%`,
                            "--open-end": `${openEnd}%`,
                          } as CSSProperties
                        }
                      >
                        <div className={styles.halfClip}>
                          <div className={trackRight} style={marqueeStyle}>
                            <p className={lineClass} aria-hidden>
                              {CURTAIN_LINE}
                            </p>
                            <p className={lineClass} aria-hidden>
                              {CURTAIN_LINE}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* <div className={styles.tail} aria-hidden="true" /> */}
      </div>

      <SideCenterStickySection
        aboutHeading={ja.aboutHeading}
        aboutText={ja.aboutText}
        sideWords={ja.sideWords}
      />
    </main>
  );
}
