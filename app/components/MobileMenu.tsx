import { usePageContext } from "vike-react/usePageContext";
import { useLanguage } from "../lib/LanguageContext";
import { navItems } from "./SiteHeader";
import styles from "./SiteLayout.module.css";

export function MobileMenu({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { urlPathname } = usePageContext();
  const { t } = useLanguage();

  return (
    <>
      <button
        type="button"
        aria-label="Close menu backdrop"
        className={styles.drawerBackdrop}
        data-open={open ? "true" : "false"}
        onClick={onClose}
      />
      <aside className={styles.drawerPanel} data-open={open ? "true" : "false"}>
        <div className={styles.drawerHeader}>
          <strong>{t("nav_home")}</strong>
          <button type="button" className={styles.menuButton} onClick={onClose} aria-label="Close menu">
            ×
          </button>
        </div>
        <nav className={styles.drawerNav}>
          <a href="/" onClick={onClose} data-active={urlPathname === "/" ? "true" : "false"}>
            {t("nav_home")}
          </a>
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={onClose}
              data-active={urlPathname === item.href ? "true" : "false"}
            >
              {t(item.key)}
            </a>
          ))}
        </nav>
      </aside>
    </>
  );
}
