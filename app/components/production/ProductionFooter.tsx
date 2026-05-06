import styles from "./ProductionFooter.module.css";

type SupportedLanguage = "ja" | "en";

type ProductionFooterProps = {
  language: SupportedLanguage;
  onToggleLanguage: () => void;
  footerLanguageAriaLabel: string;
};

export function ProductionFooter({
  language,
  onToggleLanguage,
  footerLanguageAriaLabel,
}: ProductionFooterProps) {
  return (
    <footer id="footer" className={styles.footer}>
      <button
        type="button"
        className={styles.languageToggle}
        onClick={onToggleLanguage}
        aria-label={footerLanguageAriaLabel}
      >
        <span
          className={
            language === "ja" ? styles.languageActive : styles.languageInactive
          }
        >
          日本語
        </span>
        <span className={styles.languageSeparator}> / </span>
        <span
          className={
            language === "en" ? styles.languageActive : styles.languageInactive
          }
        >
          English
        </span>
      </button>
      <p className={styles.copyright}>
        © {new Date().getFullYear()} Shoichi Hasegawa
      </p>
    </footer>
  );
}
