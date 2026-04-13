import { useLanguage } from "../lib/LanguageContext";
import styles from "./SunabaSection.module.css";

export function SunabaSection() {
  const { t } = useLanguage();

  return (
    <section className={styles.section}>
      <h1 className={styles.sunabaJp}>{t("sunaba_jp")}</h1>
      <p className={styles.sunabaEn}>{t("sunaba_en")}</p>
      <nav className={styles.nav}>
        <a href="/about">{t("nav_about")}</a>
        <a href="/reels">{t("nav_reels")}</a>
        <a href="/contact">{t("nav_contact")}</a>
      </nav>
      <p className={styles.message}>{t("sunaba_message")}</p>
    </section>
  );
}
