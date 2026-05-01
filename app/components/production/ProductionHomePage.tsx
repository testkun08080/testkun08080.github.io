import { useEffect, useRef, useState, useCallback } from "react";
import { ContactCardSection } from "../dev-integrated/ContactCardSection";
import { GreetingBurstSection } from "../dev-integrated/GreetingBurstSection";
import { HeroBurstLogoSection } from "../dev-integrated/HeroBurstLogoSection";
import { ScrollTypingHeading } from "../dev-integrated/ScrollTypingHeading";
import { SideCenterStickySection } from "../dev-integrated/SideCenterStickySection";
import { SkillsToolsSection } from "../dev-integrated/SkillsToolsSection";
import { WorkReelsSection } from "../dev-integrated/WorkReelsSection";
import { productionHomeCopy } from "../../lib/translations";
import { StickyQuickMenu } from "../portfolio/StickyQuickMenu";
import { LoadingScreen } from "./LoadingScreen";
import styles from "./ProductionHomePage.module.css";

type SupportedLanguage = "ja" | "en";

export function ProductionHomePage() {
  const workSectionRef = useRef<HTMLElement>(null);
  const skillsSectionRef = useRef<HTMLElement>(null);
  const contactSectionRef = useRef<HTMLElement>(null);
  const [language, setLanguage] = useState<"ja" | "en">("ja");
  const [heroReady, setHeroReady] = useState(false);
  const handleHeroReady = useCallback(() => setHeroReady(true), []);

  // Fallback: dismiss loading screen after 5 s if onReady never fires
  useEffect(() => {
    const id = setTimeout(() => setHeroReady(true), 5000);
    return () => clearTimeout(id);
  }, []);

  useEffect(() => {
    const previousLang = document.documentElement.lang;
    document.documentElement.lang = language;
    return () => {
      document.documentElement.lang = previousLang;
    };
  }, [language]);

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "ja" ? "en" : "ja"));
  };
  const copy = productionHomeCopy[language];

  return (
    <>
      <LoadingScreen visible={!heroReady} />
    <main className={styles.page}>
      <section id="hero" className={styles.section}>
        <HeroBurstLogoSection onReady={handleHeroReady} />
      </section>

      <section id="greeting" className={styles.section}>
        <GreetingBurstSection
          frontWord={copy.greetingFrontWord}
          bgRowText={copy.greetingBgRowText}
        />
      </section>

      <section id="sticky-side" className={styles.section}>
        <SideCenterStickySection
          aboutHeading={copy.aboutHeading}
          aboutText={copy.aboutText}
          sideWords={copy.sideWords}
        />
      </section>

      <section
        id="work"
        ref={workSectionRef}
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
        ref={skillsSectionRef}
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
        ref={contactSectionRef}
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
        <div className={styles.resumeDownloadWrap}>
          <p className={styles.resumeDownloadHeading}>{copy.resumeHeading}</p>
          <div className={styles.resumeDownloadButtons}>
            <a
              href="/resume/resume_ja.pdf"
              className={styles.resumeDownloadButton}
              download
            >
              {copy.resumeJaLabel} ({copy.resumeDownloadLabel})
            </a>
            <a
              href="/resume/resume_en.pdf"
              className={styles.resumeDownloadButton}
              download
            >
              {copy.resumeEnLabel} ({copy.resumeDownloadLabel})
            </a>
          </div>
        </div>
      </section>

      <footer id="footer" className={styles.footer}>
        <button
          type="button"
          className={styles.languageToggle}
          onClick={toggleLanguage}
          aria-label={copy.footerLanguageAriaLabel}
        >
          <span
            className={language === "ja" ? styles.languageActiveRed : styles.languageInactive}
          >
            日本語
          </span>
          <span className={styles.languageSeparator}> / </span>
          <span
            className={language === "en" ? styles.languageActiveBlue : styles.languageInactive}
          >
            English
          </span>
        </button>
        <p className={styles.copyright}>© {new Date().getFullYear()} Shoichi Hasegawa</p>
      </footer>

      <StickyQuickMenu
        items={copy.menuItems}
        language={language}
        onToggleLanguage={toggleLanguage}
        menuLabel={copy.menuButton}
        languageLabel={copy.menuLanguageLabel}
      />
    </main>
    </>
  );
}
