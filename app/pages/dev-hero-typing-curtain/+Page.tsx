import { useEffect, useRef, useState, type CSSProperties } from "react";
import { HeroBurstLogoSection } from "../../components/dev-integrated/HeroBurstLogoSection";
import { SideCenterStickySection } from "../../components/dev-integrated/SideCenterStickySection";
import { ScrollTypingHeading } from "../../components/dev-integrated/ScrollTypingHeading";
import { CurtainMarquee } from "../../components/curtain/CurtainMarquee";
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

              <CurtainMarquee
                styles={styles}
                lineCount={lineCount}
                lineText={CURTAIN_LINE}
                getHalfStyle={(i, n) => {
                  const edgeDistance = Math.min(i, n - 1 - i);
                  const reverseDistance = Math.min(i, n - 1 - i);
                  const closeStart = CLOSE_BASE + edgeDistance * CLOSE_STEP;
                  const closeEnd = closeStart + PHASE_SPAN;
                  const openStart = OPEN_BASE + reverseDistance * OPEN_STEP;
                  const openEnd = openStart + PHASE_SPAN;
                  return {
                    "--close-start": `${closeStart}%`,
                    "--close-end": `${closeEnd}%`,
                    "--open-start": `${openStart}%`,
                    "--open-end": `${openEnd}%`,
                  } as CSSProperties;
                }}
              />
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
