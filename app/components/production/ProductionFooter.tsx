import styles from "./ProductionFooter.module.css";

type SupportedLanguage = "ja" | "en";

type ProductionFooterProps = {
  language?: SupportedLanguage;
  onToggleLanguage?: () => void;
  footerLanguageAriaLabel?: string;
  resumeHeading?: string;
  resumeJaLabel?: string;
  resumeEnLabel?: string;
  resumeDownloadLabel?: string;
};

export function ProductionFooter({
  language,
  onToggleLanguage,
  footerLanguageAriaLabel,
  resumeHeading,
  resumeJaLabel,
  resumeEnLabel,
  resumeDownloadLabel,
}: ProductionFooterProps) {
  const showLanguageToggle =
    language !== undefined &&
    onToggleLanguage !== undefined &&
    footerLanguageAriaLabel !== undefined;

  return (
    <footer id="footer" className={styles.footer}>
      {showLanguageToggle ? (
        <button
          type="button"
          className={styles.languageToggle}
          onClick={onToggleLanguage}
          aria-label={footerLanguageAriaLabel}
        >
          <span
            className={
              language === "ja"
                ? styles.languageActive
                : styles.languageInactive
            }
          >
            日本語
          </span>
          <span className={styles.languageSeparator}> / </span>
          <span
            className={
              language === "en"
                ? styles.languageActive
                : styles.languageInactive
            }
          >
            English
          </span>
        </button>
      ) : null}
      <p className={styles.copyright}>
        © {new Date().getFullYear()} Shoichi Hasegawa
      </p>
    </footer>
  );
}
