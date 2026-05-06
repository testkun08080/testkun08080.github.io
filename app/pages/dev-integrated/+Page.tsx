import { useEffect, useRef, useState, type CSSProperties } from "react";
import { ContactCardSection } from "../../components/dev-integrated/ContactCardSection";
import { HeroBurstLogoSection } from "../../components/dev-integrated/HeroBurstLogoSection";
import { SideCenterStickySection } from "../../components/dev-integrated/SideCenterStickySection";
import { ScrollTypingHeading } from "../../components/dev-integrated/ScrollTypingHeading";
import { StickyQuickMenu } from "../../components/portfolio/StickyQuickMenu";
import { SkillsToolsSection } from "../../components/dev-integrated/SkillsToolsSection";
import { WorkReelsSection } from "../../components/dev-integrated/WorkReelsSection";
import { CurtainMarquee } from "../../components/curtain/CurtainMarquee";
import { clamp01 } from "../../lib/barcodeTextBridgeMath";
import { productionHomeCopy } from "../../lib/translations";
import {
  P_CURTAIN_OPEN_END,
  P_HERO_CURTAIN_CLOSE_END,
} from "../../components/dev-integrated/bridgeScrollPhases";
import styles from "./DevIntegrated.module.css";
import curtainStyles from "../dev-hero-typing-curtain/DevHeroTypingCurtain.module.css";

const INITIAL_LINE_COUNT = 16;
const REPEAT_N = 15;
const CLOSE_BASE = 6;
const CLOSE_STEP = 1.9;
const OPEN_BASE = 36;
const OPEN_STEP = 0.9;
const PHASE_SPAN = 14;

export default function Page() {
  const measureRowRef = useRef<HTMLParagraphElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const bridgeScrollProgressRef = useRef(0);
  const [lineCount, setLineCount] = useState(INITIAL_LINE_COUNT);
  const [language, setLanguage] = useState<"ja" | "en">("ja");
  const copy = productionHomeCopy[language];
  const curtainLineText = Array.from(
    { length: REPEAT_N },
    () => copy.greetingBgRowText,
  ).join(" ");

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

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
      const p = range > 0 ? clamp01((scrollY - trackTop) / range) : 0;
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

  const menuItems = [
    { href: "#hero", label: "hero" },
    { href: "#greeting", label: "greeting" },
    { href: "#sticky-side", label: "sticky" },
    { href: "#work", label: "work" },
    { href: "#skills", label: "skills" },
    { href: "#contact", label: "contact" },
    { href: "#footer", label: "footer" },
  ];

  return (
    <main className={styles.page}>
      <div className={`${styles.section} ${curtainStyles.page}`}>
        <div ref={trackRef} className={styles.bridgeTrack}>
          <div className={styles.bridgePin}>
            <div className={styles.bridgeScene}>
              <p
                ref={measureRowRef}
                className={`${curtainStyles.curtainLine} ${curtainStyles.measureRow}`}
                aria-hidden
              >
                {copy.greetingBgRowText}
              </p>

              <section
                id="hero"
                className={`${curtainStyles.layer} ${curtainStyles.layerA} ${styles.heroLayer}`}
                aria-hidden={false}
              >
                <HeroBurstLogoSection
                  bridgeScrollProgressRef={bridgeScrollProgressRef}
                />
              </section>

              <section
                id="greeting"
                className={`${curtainStyles.layer} ${curtainStyles.layerB} ${styles.greetingLayer}`}
                aria-hidden={true}
              >
                <ScrollTypingHeading
                  text={copy.greetingFrontWord}
                  headingClassName={curtainStyles.typingWord}
                  underlineClassName={curtainStyles.typingUnderline}
                  bridgeScrollProgressRef={bridgeScrollProgressRef}
                  // bridgeTypingRevealStart={P_HERO_CURTAIN_CLOSE_END}
                  // bridgeTypingRevealEnd={P_CURTAIN_OPEN_END}
                />
              </section>

              <CurtainMarquee
                styles={curtainStyles}
                lineCount={lineCount}
                lineText={curtainLineText}
                getHalfStyle={(i, n) => {
                  const edgeDistance = Math.min(i, n - 1 - i);
                  const reverseDistance = Math.max(i, n - 1 - i);
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
      </div>

      {/* <section id="sticky-side" className={styles.section}>
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
            <WorkReelsSection />
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
            <SkillsToolsSection />
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

          <footer id="footer" className={styles.footer}>
            <button
              type="button"
              className={styles.languageToggle}
              onClick={() =>
                setLanguage((prev) => (prev === "ja" ? "en" : "ja"))
              }
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
          </footer>
        </SideCenterStickySection>
      </section> */}

      <StickyQuickMenu items={menuItems} />
    </main>
  );
}
