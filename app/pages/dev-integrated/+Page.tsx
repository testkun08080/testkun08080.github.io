import { useEffect, useMemo, useRef, useState } from "react";
import { animate, onScroll } from "animejs";
import { CurtainMarquee } from "../../components/curtain/CurtainMarquee";
import { ContactCardSection } from "../../components/dev-integrated/ContactCardSection";
import { HeroBurstLogoSection } from "../../components/dev-integrated/HeroBurstLogoSection";
import { SideCenterStickySection } from "../../components/dev-integrated/SideCenterStickySection";
import { SkillsToolsSection } from "../../components/dev-integrated/SkillsToolsSection";
import { ScrollTypingHeading } from "../../components/dev-integrated/ScrollTypingHeading";
import { WorkReelsSection } from "../../components/dev-integrated/WorkReelsSection";
import { StickyQuickMenu } from "../../components/portfolio/StickyQuickMenu";
import { clamp01 } from "../../lib/barcodeTextBridgeMath";
import { productionHomeCopy } from "../../lib/translations";
import { usePrefersReducedMotion } from "../../lib/usePrefersReducedMotion";
import styles from "./DevIntegrated.module.css";

const INITIAL_LINE_COUNT = 16;
const REPEAT_N = 15;
const MOTION_PRESETS = {
  legacy: {
    closeBase: 0.06,
    closeStep: 0.022,
    openBase: 0.36,
    openStep: 0.011,
    phaseSpan: 0.14,
  },
} as const;
const ACTIVE_PRESET = MOTION_PRESETS.legacy;

const ja = productionHomeCopy.ja;
const CURTAIN_SINGLE_LINE = ja.greetingBgRowText;
const CURTAIN_LINE = Array.from(
  { length: REPEAT_N },
  () => CURTAIN_SINGLE_LINE,
).join(" ");
const copy = productionHomeCopy.ja;

function lerp(from: number, to: number, progress: number) {
  return from + (to - from) * progress;
}

function easeOutExpo(progress: number) {
  const p = clamp01(progress);
  if (p === 1) return 1;
  return 1 - 2 ** (-10 * p);
}

export default function Page() {
  const reduceMotion = usePrefersReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);
  const layerARef = useRef<HTMLElement>(null);
  const layerBRef = useRef<HTMLElement>(null);
  const measureRowRef = useRef<HTMLParagraphElement>(null);
  const curtainLeftRefs = useRef<Array<HTMLDivElement | null>>([]);
  const curtainRightRefs = useRef<Array<HTMLDivElement | null>>([]);
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
      const desired = Math.ceil(window.innerHeight / rowHeight) + buffer;
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

  const rowTiming = useMemo(
    () =>
      Array.from({ length: lineCount }, (_, i) => {
        const edgeDistance = Math.min(i, lineCount - 1 - i);
        const reverseDistance = Math.max(i, lineCount - 1 - i);
        const closeStart =
          ACTIVE_PRESET.closeBase + edgeDistance * ACTIVE_PRESET.closeStep;
        const closeEnd = closeStart + ACTIVE_PRESET.phaseSpan;
        const openStart =
          ACTIVE_PRESET.openBase + reverseDistance * ACTIVE_PRESET.openStep;
        const openEnd = openStart + ACTIVE_PRESET.phaseSpan;
        return { closeStart, closeEnd, openStart, openEnd };
      }),
    [lineCount],
  );

  useEffect(() => {
    const track = trackRef.current;
    const layerA = layerARef.current;
    const layerB = layerBRef.current;
    if (!track || !layerA || !layerB) return;

    const applyBridgeProgress = (progress: number) => {
      rowTiming.forEach((timing, i) => {
        const left = curtainLeftRefs.current[i];
        const right = curtainRightRefs.current[i];
        if (!left || !right) return;

        const closeRaw = clamp01(
          (progress - timing.closeStart) /
            (timing.closeEnd - timing.closeStart),
        );
        const openRaw = clamp01(
          (progress - timing.openStart) / (timing.openEnd - timing.openStart),
        );
        const close = easeOutExpo(closeRaw);
        const open = easeOutExpo(openRaw);

        const leftX = open > 0 ? lerp(0, -105, open) : lerp(-105, 0, close);
        const rightX = open > 0 ? lerp(0, 105, open) : lerp(105, 0, close);
        left.style.transform = `translate3d(${leftX}%, 0, 0)`;
        right.style.transform = `translate3d(${rightX}%, 0, 0)`;
      });

      const swap = clamp01((progress - 0.44) / 0.12);
      layerA.style.opacity = String(1 - swap);
      layerB.style.opacity = String(swap);
      const bVisible = swap > 0.5;
      layerA.style.pointerEvents = bVisible ? "none" : "auto";
      layerB.style.pointerEvents = bVisible ? "auto" : "none";
      layerA.style.visibility = bVisible ? "hidden" : "visible";
      layerB.style.visibility = bVisible ? "visible" : "hidden";
      layerA.style.zIndex = bVisible ? "1" : "2";
      layerB.style.zIndex = bVisible ? "2" : "1";
    };

    if (reduceMotion) {
      applyBridgeProgress(1);
      return;
    }

    applyBridgeProgress(0);

    const progressSync = animate(track, {
      opacity: [1, 1],
      duration: 1,
      ease: "linear",
      autoplay: onScroll({
        enter: "top top",
        leave: "bottom bottom",
        sync: true,
        onUpdate: (self) => {
          const observer = self as { progress?: number };
          if (typeof observer.progress !== "number") return;
          const bridgeProgress = clamp01(observer.progress);
          bridgeScrollProgressRef.current = bridgeProgress;
          applyBridgeProgress(bridgeProgress);
        },
      }),
    });

    return () => {
      progressSync.revert();
      applyBridgeProgress(0);
    };
  }, [reduceMotion, rowTiming]);

  return (
    <main className={styles.page}>
      <div className={styles.section}>
        <div ref={trackRef} className={styles.bridgeTrack}>
          <div className={styles.bridgePin}>
            <div className={styles.bridgeScene}>
              <p
                ref={measureRowRef}
                className={`${styles.curtainLine} ${styles.measureRow}`}
                aria-hidden
              >
                {CURTAIN_SINGLE_LINE}
              </p>
              <section
                id="hero"
                ref={layerARef}
                className={`${styles.layer} ${styles.layerA} ${styles.heroLayer}`}
                aria-hidden={false}
              >
                <HeroBurstLogoSection
                  bridgeScrollProgressRef={bridgeScrollProgressRef}
                />
              </section>
              <section
                ref={layerBRef}
                className={`${styles.layer} ${styles.layerB} ${styles.greetingLayer}`}
                aria-hidden
              >
                <ScrollTypingHeading
                  text="こんにちわ"
                  headingClassName={styles.typingWord}
                  underlineClassName={styles.typingUnderline}
                  bridgeScrollProgressRef={bridgeScrollProgressRef}
                  bridgeTypingRevealStart={0.52}
                  bridgeTypingRevealEnd={0.76}
                />
              </section>
              <CurtainMarquee
                styles={styles}
                rootClassName={styles.heroCurtain}
                lineCount={lineCount}
                lineText={CURTAIN_LINE}
                onLeftHalfRef={(i, el) => {
                  curtainLeftRefs.current[i] = el;
                }}
                onRightHalfRef={(i, el) => {
                  curtainRightRefs.current[i] = el;
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <section id="sticky-side" className={styles.section}>
        <SideCenterStickySection
          aboutHeading={copy.aboutHeading}
          aboutText={copy.aboutText}
          sideWords={copy.sideWords}
        >
          <section
            id="work"
            className={`${styles.section} ${styles.workSection}`}
          >
            <header className={styles.sectionHead}>
              <ScrollTypingHeading
                text={copy.workHeading}
                headingClassName={styles.sectionHeadingWord}
                underlineClassName={styles.sectionHeadingLine}
              />
            </header>
            <WorkReelsSection
              fallbackPrefix={copy.reelsFallbackPrefix}
              fallbackLinkLabel={copy.reelsFallbackLink}
            />
          </section>

          <section
            id="skills"
            className={`${styles.section} ${styles.skillsSection}`}
          >
            <header className={styles.sectionHead}>
              <ScrollTypingHeading
                text={copy.skillsHeading}
                headingClassName={styles.sectionHeadingWord}
                underlineClassName={styles.sectionHeadingLine}
              />
            </header>
            <SkillsToolsSection
              showMoreLabel={copy.skillsShowMore}
              closeLabel={copy.skillsClose}
            />
          </section>

          <section
            id="contact"
            className={`${styles.section} ${styles.contactSection}`}
          >
            <header className={styles.sectionHead}>
              <ScrollTypingHeading
                text={copy.contactHeading}
                headingClassName={styles.sectionHeadingWord}
                underlineClassName={styles.sectionHeadingLine}
              />
            </header>
            <ContactCardSection />
          </section>
        </SideCenterStickySection>
      </section>

      {/* <footer id="footer" className={styles.footer}>
              <button
                type="button"
                className={styles.languageToggle}
                onClick={toggleLanguage}
                aria-label={copy.footerLanguageAriaLabel}
              >
                <span
                  className={
                    language === "ja"
                      ? styles.languageActiveRed
                      : styles.languageInactive
                  }
                >
                  日本語
                </span>
                <span className={styles.languageSeparator}> / </span>
                <span
                  className={
                    language === "en"
                      ? styles.languageActiveBlue
                      : styles.languageInactive
                  }
                >
                  English
                </span>
              </button>
              <p className={styles.copyright}>
                © {new Date().getFullYear()} Shoichi Hasegawa
              </p>
            </footer> */}

      {/* <StickyQuickMenu
        items={copy.menuItems}
        language={language}
        onToggleLanguage={toggleLanguage}
        menuLabel={copy.menuButton}
        languageLabel={copy.menuLanguageLabel}
      /> */}
    </main>
  );
}
