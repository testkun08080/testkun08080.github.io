import { useLanguage } from "../lib/LanguageContext";
import styles from "./SiteLayout.module.css";

export function SiteFooter() {
  const { t } = useLanguage();

  return <footer className={styles.footer}>{t("footer_copyright")}</footer>;
}
