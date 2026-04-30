import { useRef } from "react";
import { ScrollTypingHeading } from "../../components/dev-integrated/ScrollTypingHeading";
import styles from "./DevBurstOverlayAnimeScrollOnly.module.css";

const FRONT_WORD = "konchiwa";

export default function Page() {
  const triggerRef = useRef<HTMLElement>(null);

  return (
    <main className={styles.page}>
      <section className={styles.intro}>
        <h1 className={styles.title}>dev-burst-overlay-anime-scroll-only</h1>
        <p className={styles.copy}>
          ラインとタイピングだけをスクロール同期したページ（animejs）。
        </p>
      </section>

      <section ref={triggerRef} className={styles.stage}>
        <div className={styles.frontLayer}>
          <ScrollTypingHeading
            text={FRONT_WORD}
            targetRef={triggerRef}
            enter="bottom top"
            leave="center bottom"
            headingClassName={styles.word}
            underlineClassName={styles.underline}
          />
        </div>
      </section>
    </main>
  );
}
