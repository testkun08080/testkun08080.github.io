import type { ReactNode } from "react";
import { useLanguage } from "../lib/LanguageContext";
import styles from "./PageFrame.module.css";

export function PageFrame({
  titleKey,
  children,
}: {
  titleKey: "nav_sunaba" | "about_title" | "reels_title" | "contact_title";
  children: ReactNode;
}) {
  const { t } = useLanguage();

  return (
    <section className={styles.page}>
      <h1 className={styles.title}>{t(titleKey)}</h1>
      <div className={styles.inner}>{children}</div>
    </section>
  );
}
