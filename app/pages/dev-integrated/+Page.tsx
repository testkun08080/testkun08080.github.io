import { useEffect, useRef, useState } from "react";
import { ContactCardSection } from "../../components/dev-integrated/ContactCardSection";
import { FloatingThemeControls } from "../../components/dev-integrated/FloatingThemeControls";
import { GreetingBurstSection } from "../../components/dev-integrated/GreetingBurstSection";
import { HeroBurstLogoSection } from "../../components/dev-integrated/HeroBurstLogoSection";
import { SideCenterStickySection } from "../../components/dev-integrated/SideCenterStickySection";
import { ScrollTypingHeading } from "../../components/dev-integrated/ScrollTypingHeading";
import { StickyQuickMenu } from "../../components/portfolio/StickyQuickMenu";
import { SkillsToolsSection } from "../../components/dev-integrated/SkillsToolsSection";
import { WorkReelsSection } from "../../components/dev-integrated/WorkReelsSection";
import styles from "./DevIntegrated.module.css";

const ABOUT_TEXT = `Nice to meet you!
I'm Shoichi Hasegawa from Japan (๑•᎑•๑)
I am passionate about creating and supporting outstanding art through technology, especially LookDev and shader development.
With both engineering and art backgrounds, I bridge technical problem-solving and creative vision.`;

export default function Page() {
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
