import { useEffect, useRef, useState } from "react";
import { ContactCardSection } from "../dev-integrated/ContactCardSection";
import { GreetingBurstSection } from "../dev-integrated/GreetingBurstSection";
import { HeroBurstLogoSection } from "../dev-integrated/HeroBurstLogoSection";
import { ScrollTypingHeading } from "../dev-integrated/ScrollTypingHeading";
import { SideCenterStickySection } from "../dev-integrated/SideCenterStickySection";
import { SkillsToolsSection } from "../dev-integrated/SkillsToolsSection";
import { WorkReelsSection } from "../dev-integrated/WorkReelsSection";
import { StickyQuickMenu } from "../portfolio/StickyQuickMenu";
import styles from "./ProductionHomePage.module.css";

type SupportedLanguage = "ja" | "en";

const PAGE_COPY: Record<
  SupportedLanguage,
  {
    greetingFrontWord: string;
    greetingBgRowText: string;
    aboutHeading: string;
    aboutText: string;
    sideWords: readonly string[];
    workHeading: string;
    skillsHeading: string;
    contactHeading: string;
    menuButton: string;
    menuLanguageLabel: string;
    menuItems: { href: string; label: string }[];
    reelsFallbackPrefix: string;
    reelsFallbackLink: string;
    skillsShowMore: string;
    skillsClose: string;
    resumeHeading: string;
    resumeJaLabel: string;
    resumeEnLabel: string;
    resumeDownloadLabel: string;
    footerLanguageAriaLabel: string;
  }
> = {
  ja: {
    greetingFrontWord: "こんにちは",
    greetingBgRowText: "こんにちは やあ どうも",
    aboutHeading: "About",
    aboutText: `はじめまして！
長谷川翔一と申します。日本生まれです (๑•᎑•๑)
テクノロジーを活用して素晴らしいアートやコンテンツを支援・創造することに情熱を持っています。特にLookDevやシェーダー開発が得意分野です。
エンジニアリングとアートの両方のバックグラウンドを持ち、技術的な問題解決力とクリエイティブなビジョンを兼ね備えています。`,
    sideWords: [
      "ルックデブ",
      "シェーダー開発",
      "クリエイティブコーディング",
      "スクロール演出",
      "アニメーション実装",
      "ビジュアル制作",
    ],
    workHeading: "Work",
    skillsHeading: "Skills",
    contactHeading: "Contact",
    menuButton: "メニュー",
    menuLanguageLabel: "言語",
    menuItems: [
      { href: "#hero", label: "TOP" },
      { href: "#sticky-side", label: "自己紹介" },
      { href: "#work", label: "作品" },
      { href: "#skills", label: "スキル" },
      { href: "#contact", label: "連絡先" },
    ],
    reelsFallbackPrefix: "埋め込みが表示されない場合は",
    reelsFallbackLink: "YouTubeで開く",
    skillsShowMore: "もっと見る",
    skillsClose: "閉じる",
    resumeHeading: "レジュメをダウンロード",
    resumeJaLabel: "日本語",
    resumeEnLabel: "英語",
    resumeDownloadLabel: "ダウンロード",
    footerLanguageAriaLabel: "日本語と英語を切り替える",
  },
  en: {
    greetingFrontWord: "konchiwa",
    greetingBgRowText: "hi there hello oi",
    aboutHeading: "About",
    aboutText: `Nice to meet you!
I'm Shoichi Hasegawa from Japan (๑•᎑•๑)
I am passionate about creating and supporting outstanding art through technology, especially LookDev and shader development.
With both engineering and art backgrounds, I bridge technical problem-solving and creative vision.`,
    sideWords: [
      "lookdev pipeline",
      "shader support",
      "creative coding",
      "scroll linked",
      "animejs motion",
      "visual crafting",
    ],
    workHeading: "Work",
    skillsHeading: "Skills",
    contactHeading: "Contact",
    menuButton: "Menu",
    menuLanguageLabel: "Language",
    menuItems: [
      { href: "#hero", label: "TOP" },
      { href: "#sticky-side", label: "about" },
      { href: "#work", label: "work" },
      { href: "#skills", label: "skills" },
      { href: "#contact", label: "contact" },
    ],
    reelsFallbackPrefix: "If the embed is unavailable,",
    reelsFallbackLink: "open on YouTube",
    skillsShowMore: "Show more",
    skillsClose: "Close",
    resumeHeading: "Download Resume",
    resumeJaLabel: "Japanese",
    resumeEnLabel: "English",
    resumeDownloadLabel: "Download",
    footerLanguageAriaLabel: "Switch language between Japanese and English",
  },
};

export function ProductionHomePage() {
  const workSectionRef = useRef<HTMLElement>(null);
  const skillsSectionRef = useRef<HTMLElement>(null);
  const contactSectionRef = useRef<HTMLElement>(null);
  const [language, setLanguage] = useState<"ja" | "en">("ja");

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "ja" ? "en" : "ja"));
  };
  const copy = PAGE_COPY[language];

  return (
    <main className={styles.page}>
      {/* <FloatingThemeControls /> */}
      <section id="hero" className={styles.section}>
        <HeroBurstLogoSection />
      </section>

      <section id="greeting" className={styles.section}>
        <GreetingBurstSection
          frontWord={copy.greetingFrontWord}
          bgRowText={copy.greetingBgRowText}
        />
      </section>

      <section id="sticky-side" className={styles.section}>
        <SideCenterStickySection
          aboutHeading={copy.aboutHeading}
          aboutText={copy.aboutText}
          sideWords={copy.sideWords}
        />
      </section>

      <section
        id="work"
        ref={workSectionRef}
        className={`${styles.section} ${styles.workSection}`}
      >
        <header className={styles.sectionHead}>
          <ScrollTypingHeading
            text={copy.workHeading}
            headingClassName={styles.sectionHeadingWord}
            underlineClassName={styles.sectionHeadingLine}
          />
        </header>
        <WorkReelsSection
          fallbackPrefix={copy.reelsFallbackPrefix}
          fallbackLinkLabel={copy.reelsFallbackLink}
        />
      </section>

      <section
        id="skills"
        ref={skillsSectionRef}
        className={`${styles.section} ${styles.skillsSection}`}
      >
        <header className={styles.sectionHead}>
          <ScrollTypingHeading
            text={copy.skillsHeading}
            headingClassName={styles.sectionHeadingWord}
            underlineClassName={styles.sectionHeadingLine}
          />
        </header>
        <SkillsToolsSection
          showMoreLabel={copy.skillsShowMore}
          closeLabel={copy.skillsClose}
        />
      </section>

      <section
        id="contact"
        ref={contactSectionRef}
        className={`${styles.section} ${styles.contactSection}`}
      >
        <header className={styles.sectionHead}>
          <ScrollTypingHeading
            text={copy.contactHeading}
            headingClassName={styles.sectionHeadingWord}
            underlineClassName={styles.sectionHeadingLine}
          />
        </header>
        <ContactCardSection />
        <div className={styles.resumeDownloadWrap}>
          <p className={styles.resumeDownloadHeading}>{copy.resumeHeading}</p>
          <div className={styles.resumeDownloadButtons}>
            <a
              href="/resume_ja.pdf"
              className={styles.resumeDownloadButton}
              download
            >
              {copy.resumeJaLabel} ({copy.resumeDownloadLabel})
            </a>
            <a
              href="/resume_en.pdf"
              className={styles.resumeDownloadButton}
              download
            >
              {copy.resumeEnLabel} ({copy.resumeDownloadLabel})
            </a>
          </div>
        </div>
      </section>

      <footer id="footer" className={styles.footer}>
        <button
          type="button"
          className={styles.languageToggle}
          onClick={toggleLanguage}
          aria-label={copy.footerLanguageAriaLabel}
        >
          <span
            className={language === "ja" ? styles.languageActiveRed : styles.languageInactive}
          >
            日本語
          </span>
          <span className={styles.languageSeparator}> / </span>
          <span
            className={language === "en" ? styles.languageActiveBlue : styles.languageInactive}
          >
            English
          </span>
        </button>
        <p className={styles.copyright}>© {new Date().getFullYear()} Shoichi Hasegawa</p>
      </footer>

      <StickyQuickMenu
        items={copy.menuItems}
        language={language}
        onToggleLanguage={toggleLanguage}
        menuLabel={copy.menuButton}
        languageLabel={copy.menuLanguageLabel}
      />
    </main>
  );
}
