import { usePageContext } from "vike-react/usePageContext";
import { useLanguage } from "../lib/LanguageContext";
import styles from "./SiteLayout.module.css";

const navItems = [
  { href: "/sunaba", key: "nav_sunaba" },
  { href: "/about", key: "nav_about" },
  { href: "/reels", key: "nav_reels" },
  { href: "/contact", key: "nav_contact" },
] as const;

const logoUrl = new URL("../../images/logo.svg", import.meta.url).href;

export function SiteHeader({ onOpenMenu }: { onOpenMenu: () => void }) {
  const { urlPathname } = usePageContext();
  const { language, toggleLanguage, t } = useLanguage();

  return (
    <header className={styles.header}>
      <div className={styles.headerInner}>
        <a href="/" className={styles.logoLink} aria-label={String(t("nav_home"))}>
          <img src={logoUrl} alt="site logo" className={styles.logoImage} />
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
            {language.toUpperCase()}
          </button>
          <button
            type="button"
            onClick={onOpenMenu}
            className={styles.menuButton}
            aria-label="Open menu"
          >
            ☰
          </button>
        </div>
      </div>
    </header>
  );
}

export { navItems };
