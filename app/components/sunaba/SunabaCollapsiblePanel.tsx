import { useId, useState } from "react";
import { useLanguage } from "../../lib/LanguageContext";
import { SunabaBoard } from "./SunabaBoard";
import styles from "./SunabaCollapsiblePanel.module.css";

type Props = {
  openLabel: string;
  closeLabel: string;
};

export function SunabaCollapsiblePanel({ openLabel, closeLabel }: Props) {
  const { t } = useLanguage();
  const panelId = useId();
  const [expanded, setExpanded] = useState(false);

  return (
    <section className={styles.panel} aria-labelledby={`${panelId}-toggle`}>
      <div
        id={panelId}
        className={`${styles.content} ${expanded ? styles.contentExpanded : styles.contentCollapsed}`}
        aria-hidden={!expanded}
      >
        <p className={styles.message}>{t("sunaba_message")}</p>
        <SunabaBoard />
      </div>

      <div className={styles.toggleArea}>
        <button
          id={`${panelId}-toggle`}
          type="button"
          className={styles.toggleButton}
          aria-expanded={expanded}
          aria-controls={panelId}
          onClick={() => setExpanded((prev) => !prev)}
        >
          {expanded ? closeLabel : openLabel}
        </button>
      </div>
    </section>
  );
}
