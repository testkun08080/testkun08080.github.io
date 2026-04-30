import { AboutStickySection } from "../../components/dev-integrated/AboutStickySection";
import { ContactCardSection } from "../../components/dev-integrated/ContactCardSection";
import { FloatingThemeControls } from "../../components/dev-integrated/FloatingThemeControls";
import { GreetingBurstSection } from "../../components/dev-integrated/GreetingBurstSection";
import { HeroBurstLogoSection } from "../../components/dev-integrated/HeroBurstLogoSection";
import { SkillsToolsSection } from "../../components/dev-integrated/SkillsToolsSection";
import { WorkReelsSection } from "../../components/dev-integrated/WorkReelsSection";
import styles from "./DevIntegrated.module.css";

const ABOUT_TEXT = `Nice to meet you!
I'm Shoichi Hasegawa from Japan (๑•᎑•๑)
I am passionate about creating and supporting outstanding art through technology, especially LookDev and shader development.
With both engineering and art backgrounds, I bridge technical problem-solving and creative vision.`;

export default function Page() {
  return (
    <main className={styles.page}>
      <FloatingThemeControls />
      <section id="hero" className={styles.section}>
        <HeroBurstLogoSection />
      </section>

      <section id="greeting" className={styles.section}>
        <GreetingBurstSection />
      </section>

      <section id="about" className={styles.section}>
        <AboutStickySection aboutText={ABOUT_TEXT} />
      </section>

      <section id="work" className={`${styles.section} ${styles.workSection}`}>
        <header className={styles.sectionHead}>
          <p>work</p>
          <h2>Selected Reels</h2>
        </header>
        <WorkReelsSection />
      </section>

      <section id="skills" className={`${styles.section} ${styles.skillsSection}`}>
        <header className={styles.sectionHead}>
          <p>skills</p>
          <h2>Software &amp; Tools</h2>
        </header>
        <SkillsToolsSection />
      </section>

      <section id="contact" className={`${styles.section} ${styles.contactSection}`}>
        <header className={styles.sectionHead}>
          <p>contact</p>
          <h2>Let's build together</h2>
        </header>
        <ContactCardSection />
      </section>

      <footer id="footer" className={styles.footer}>
        <p>© {new Date().getFullYear()} Shoichi Hasegawa</p>
        <a href="/dev">Back to /dev</a>
      </footer>
    </main>
  );
}
