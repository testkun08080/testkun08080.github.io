import { usePageContext } from "vike-react/usePageContext";
import { useLanguage } from "../lib/LanguageContext";
import styles from "./SiteLayout.module.css";

const navItems = [
  { href: "/sunaba", key: "nav_sunaba" },
  { href: "/about", key: "nav_about" },
  { href: "/reels", key: "nav_reels" },
  { href: "/contact", key: "nav_contact" },
] as const;

const homeIconUrl = new URL("../../src/assets/header_homebutton.png", import.meta.url).href;
const languageIconUrl = new URL("../../src/assets/header_languageicon.png", import.meta.url).href;
const menuIconUrl = new URL("../../src/assets/header_menuicon.svg", import.meta.url).href;

export function SiteHeader({ onOpenMenu }: { onOpenMenu: () => void }) {
  const { urlPathname } = usePageContext();
  const { language, toggleLanguage, t } = useLanguage();

  return (
    <header className={styles.header}>
      <div className={styles.headerInner}>
        <a href="/" className={styles.homeLink} aria-label={String(t("nav_home"))}>
          <img src={homeIconUrl} alt={String(t("nav_home"))} className={styles.homeIcon} />
        </a>

        <nav className={styles.desktopNav} aria-label="Primary navigation">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              data-active={urlPathname === item.href ? "true" : "false"}
            >
              {t(item.key)}
            </a>
          ))}
        </nav>

        <div className={styles.actions}>
          <button
            type="button"
            onClick={toggleLanguage}
            className={styles.langButton}
            aria-label={String(t("nav_language"))}
          >
            <img src={languageIconUrl} alt={String(t("nav_language"))} className={styles.languageIcon} />
            <span>{language.toUpperCase()}</span>
          </button>
          <button
            type="button"
            onClick={onOpenMenu}
            className={styles.menuButton}
            aria-label="Open menu"
          >
            <img src={menuIconUrl} alt="menu icon" className={styles.menuIcon} />
          </button>
        </div>
      </div>
    </header>
  );
}

export { navItems };
