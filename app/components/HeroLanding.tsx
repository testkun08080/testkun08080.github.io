import { useRef } from "react";
import { useLanguage } from "../lib/LanguageContext";
import { useSmoothPointer } from "../hooks/useSmoothPointer";
import styles from "./HeroLanding.module.css";
import logoUrl from "../../images/logo.svg";
import coverUrl from "../../images/web表紙.png";

export function HeroLanding() {
  const { t } = useLanguage();
  const heroRef = useRef<HTMLDivElement>(null);

  useSmoothPointer(heroRef);

  return (
    <section className={styles.hero} ref={heroRef}>
      <img src={coverUrl} alt="top visual" className={styles.bg} />
      <div className={styles.overlay} />
      <div className={styles.content}>
        <div className={styles.center}>
          <div className={styles.logoWrap}>
            <img src={logoUrl} alt="logo" className={styles.logo} />
          </div>
          <h1 className={styles.title}>{t("hero_title")}</h1>
          <p className={styles.subtitle}>{t("hero_subtitle")}</p>
          <p className={styles.description}>{t("hero_description")}</p>
          <div className={styles.ctaRow}>
            <a href="/sunaba" className={styles.ctaPrimary}>
              {t("hero_cta_primary")}
            </a>
            <a href="/about" className={styles.ctaSecondary}>
              {t("hero_cta_secondary")}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
