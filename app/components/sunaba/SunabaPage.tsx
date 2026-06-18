import { animate } from "animejs";
import { useEffect, useRef } from "react";
import { ScrollTypingHeading } from "../dev-integrated/ScrollTypingHeading";
import { StickyQuickMenu } from "../portfolio/StickyQuickMenu";
import { ProductionFooter } from "../production/ProductionFooter";
import { sunabaCopy } from "../../lib/translations";
import { useLanguage } from "../../lib/LanguageContext";
import { usePrefersReducedMotion } from "../../lib/usePrefersReducedMotion";
import { SunabaBoard } from "./SunabaBoard";
import styles from "./SunabaPage.module.css";

const SUNABA_TITLE = "sunaba";

export function SunabaPage() {
  const { language, toggleLanguage, t } = useLanguage();
  const reducedMotion = usePrefersReducedMotion();
  const bridgeProgressRef = useRef(0);
  const copy = sunabaCopy[language];

  useEffect(() => {
    const previousLang = document.documentElement.lang;
    document.documentElement.lang = language;
    return () => {
      document.documentElement.lang = previousLang;
    };
  }, [language]);

  useEffect(() => {
    if (reducedMotion) {
      bridgeProgressRef.current = 1;
      window.dispatchEvent(new Event("scroll"));
      return;
    }

    const state = { p: 0 };
    bridgeProgressRef.current = 0;

    const anim = animate(state, {
      p: [0, 1],
      duration: 1200,
      ease: "out(2)",
      onUpdate: () => {
        bridgeProgressRef.current = state.p;
        window.dispatchEvent(new Event("scroll"));
      },
      onComplete: () => {
        bridgeProgressRef.current = 1;
        window.dispatchEvent(new Event("scroll"));
      },
    });

    return () => {
      anim.pause();
      bridgeProgressRef.current = 1;
    };
  }, [reducedMotion]);

  return (
    <div className={styles.page}>
      <div className={styles.content}>
        <header className={styles.header}>
          <ScrollTypingHeading
            key={SUNABA_TITLE}
            text={SUNABA_TITLE}
            headingClassName={styles.typingWord}
            underlineClassName={styles.typingUnderline}
            bridgeScrollProgressRef={bridgeProgressRef}
            bridgeTypingRevealStart={0}
            bridgeTypingRevealEnd={1}
          />
          <p className={styles.description}>{t("sunaba_message")}</p>
        </header>
        <main className={styles.main}>
          <SunabaBoard />
        </main>
        <ProductionFooter
          language={language}
          onToggleLanguage={toggleLanguage}
          footerLanguageAriaLabel={String(t("sunaba_footer_language_aria"))}
        />
      </div>
      <StickyQuickMenu
        items={copy.menuItems}
        menuLabel={String(t("sunaba_menu_button"))}
        languageLabel={String(t("nav_language"))}
        languageAriaLabel={String(t("sunaba_footer_language_aria"))}
        language={language}
        onToggleLanguage={toggleLanguage}
        visibleOverride
      />
    </div>
  );
}
