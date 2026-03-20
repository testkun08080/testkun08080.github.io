import { useLanguage } from "../../lib/LanguageContext";
import styles from "./Sunaba.module.css";

export default function Page() {
  const { t } = useLanguage();

  return (
    <section className={styles.hero}>
      <h1 className={styles.sunabaJp}>{t("sunaba_jp")}</h1>
      <p className={styles.sunabaEn}>{t("sunaba_en")}</p>
      <nav className={styles.nav}>
        <a href="/about">{t("nav_about")}</a>
        <a href="/reels">{t("nav_reels")}</a>
        <a href="/contact">{t("nav_contact")}</a>
      </nav>
      <p className="mt-8 max-w-[32ch] text-center text-sm tracking-[0.08em] text-slate-700/90">
        {t("sunaba_message")}
      </p>
    </section>
  );
}
