import { ScrollTypingHeading } from "./ScrollTypingHeading";
import styles from "../shared-dev-assets/DevBurstOverlayAnime.module.css";

type GreetingBurstSectionProps = {
  frontWord?: string;
};

/**
 * Greeting front layer only — the rolling text-row background is now provided by the
 * shared sticky layer in HeroGreetingNarrative so it can flow continuously from the hero
 * scroll into the greeting without a visual seam.
 */
export function GreetingBurstSection({
  frontWord = "konchiwa",
}: GreetingBurstSectionProps) {
  return (
    <main className={styles.page}>
      <section className={styles.stage}>
        {/* Bottom fade: rows dissolve into About section as you scroll past greeting */}
        <div className={styles.fadeBottom} aria-hidden />

        <div className={styles.frontLayer}>
          <ScrollTypingHeading
            text={frontWord}
            headingClassName={styles.word}
            underlineClassName={styles.underline}
          />
        </div>
      </section>
    </main>
  );
}
