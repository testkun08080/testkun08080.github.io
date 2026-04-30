import { useEffect, useRef, useState } from "react";
import { ContactCardSection } from "../dev-integrated/ContactCardSection";
import { FloatingThemeControls } from "../dev-integrated/FloatingThemeControls";
import { GreetingBurstSection } from "../dev-integrated/GreetingBurstSection";
import { HeroBurstLogoSection } from "../dev-integrated/HeroBurstLogoSection";
import { ScrollTypingHeading } from "../dev-integrated/ScrollTypingHeading";
import { SideCenterStickySection } from "../dev-integrated/SideCenterStickySection";
import { SkillsToolsSection } from "../dev-integrated/SkillsToolsSection";
import { WorkReelsSection } from "../dev-integrated/WorkReelsSection";
import { StickyQuickMenu } from "../portfolio/StickyQuickMenu";
import styles from "./ProductionHomePage.module.css";

const ABOUT_TEXT = `Nice to meet you!
I'm Shoichi Hasegawa from Japan (๑•᎑•๑)
I am passionate about creating and supporting outstanding art through technology, especially LookDev and shader development.
With both engineering and art backgrounds, I bridge technical problem-solving and creative vision.`;

export function ProductionHomePage() {
  const workSectionRef = useRef<HTMLElement>(null);
  const skillsSectionRef = useRef<HTMLElement>(null);
  const contactSectionRef = useRef<HTMLElement>(null);
  const [language, setLanguage] = useState<"ja" | "en">("ja");

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

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
      <FloatingThemeControls />
      <section id="hero" className={styles.section}>
        <HeroBurstLogoSection />
      </section>

      <section id="greeting" className={styles.section}>
        <GreetingBurstSection />
      </section>

      <section id="sticky-side" className={styles.section}>
        <SideCenterStickySection aboutText={ABOUT_TEXT} />
      </section>

      <section
        id="work"
        ref={workSectionRef}
        className={`${styles.section} ${styles.workSection}`}
      >
        <header className={styles.sectionHead}>
          <ScrollTypingHeading
            text="Work"
            headingClassName={styles.sectionHeadingWord}
            underlineClassName={styles.sectionHeadingLine}
          />
        </header>
        <WorkReelsSection />
      </section>

      <section
        id="skills"
        ref={skillsSectionRef}
        className={`${styles.section} ${styles.skillsSection}`}
      >
        <header className={styles.sectionHead}>
          <ScrollTypingHeading
            text="Skills"
            headingClassName={styles.sectionHeadingWord}
            underlineClassName={styles.sectionHeadingLine}
          />
        </header>
        <SkillsToolsSection />
      </section>

      <section
        id="contact"
        ref={contactSectionRef}
        className={`${styles.section} ${styles.contactSection}`}
      >
        <header className={styles.sectionHead}>
          <ScrollTypingHeading
            text="Contact"
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
          onClick={() => setLanguage((prev) => (prev === "ja" ? "en" : "ja"))}
          aria-label="Switch language between Japanese and English"
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

      <StickyQuickMenu items={menuItems} />
    </main>
  );
}
