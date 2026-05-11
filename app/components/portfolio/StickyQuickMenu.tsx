import { animate, stagger } from "animejs";
import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { subscribeWindowRaf } from "../../lib/windowRafDriver";
import styles from "./StickyQuickMenu.module.css";

type StickyQuickMenuItem = {
  href: string;
  label: string;
  iconKey?: string;
};

type StickyQuickMenuProps = {
  items: StickyQuickMenuItem[];
  heroSelector?: string;
  upwardThreshold?: number;
  language?: "ja" | "en";
  onToggleLanguage?: () => void;
  menuLabel?: string;
  languageLabel?: string;
  languageAriaLabel?: string;
  visibleOverride?: boolean;
  rootClassName?: string;
  rootStyle?: CSSProperties;
};

export function StickyQuickMenu({
  items,
  heroSelector = "#hero",
  upwardThreshold = 10,
  language,
  onToggleLanguage,
  menuLabel = "Menu",
  languageLabel = "Language",
  languageAriaLabel = "Switch language between Japanese and English",
  visibleOverride,
  rootClassName,
  rootStyle,
}: StickyQuickMenuProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const menuId = useId();
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const lastScrollYRef = useRef(0);
  const upwardDistanceRef = useRef(0);
  const visibleRef = useRef(false);

  const menuItems = useMemo(() => items, [items]);
  const menuVisible = menuOpen || prefersReducedMotion;
  const effectiveVisible =
    typeof visibleOverride === "boolean" ? visibleOverride : isVisible;

  useEffect(() => {
    if (typeof window === "undefined" || !("matchMedia" in window)) return;
    const mediaReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );

    const handleReducedMotionChange = () =>
      setPrefersReducedMotion(mediaReducedMotion.matches);

    handleReducedMotionChange();

    mediaReducedMotion.addEventListener("change", handleReducedMotionChange);

    return () => {
      mediaReducedMotion.removeEventListener(
        "change",
        handleReducedMotionChange,
      );
    };
  }, []);

  useEffect(() => {
    const button = buttonRef.current;
    const menu = menuRef.current;
    if (!button || !menu || prefersReducedMotion) return;

    animate(button, {
      scale: [1, 0.92, 1.06, 1],
      rotate: menuOpen ? ["0deg", "4deg", "0deg"] : ["0deg", "-3deg", "0deg"],
      duration: 420,
      ease: "out(4)",
    });

    if (menuOpen) {
      const links = menu.querySelectorAll("a, button");
      animate(menu, {
        opacity: [0, 1],
        scale: [0.8, 1],
        translateY: [8, 0],
        duration: 260,
        ease: "out(3)",
      });
      animate(links, {
        opacity: [0, 1],
        translateX: [10, 0],
        delay: stagger(55),
        duration: 260,
        ease: "out(2)",
      });
      return;
    }

    animate(menu, {
      opacity: [1, 0],
      scale: [1, 0.92],
      translateY: [0, 8],
      duration: 180,
      ease: "in(2)",
    });
  }, [menuOpen, prefersReducedMotion]);

  useEffect(() => {
    if (typeof visibleOverride === "boolean") return;

    const updateVisibility = () => {
      const currentScrollY = window.scrollY;
      const hero = document.querySelector<HTMLElement>(heroSelector);
      const heroBottom = hero?.getBoundingClientRect().bottom ?? -1;
      const isOutsideHero = heroBottom <= 0;
      const deltaY = currentScrollY - lastScrollYRef.current;

      if (!isOutsideHero) {
        upwardDistanceRef.current = 0;
        if (visibleRef.current) {
          visibleRef.current = false;
          setIsVisible(false);
          setMenuOpen(false);
        }
        lastScrollYRef.current = currentScrollY;
        return;
      }
      lastScrollYRef.current = currentScrollY;

      if (deltaY > 0) {
        upwardDistanceRef.current = 0;
        if (visibleRef.current) {
          visibleRef.current = false;
          setIsVisible(false);
          setMenuOpen(false);
        }
        return;
      }

      if (deltaY < 0) {
        upwardDistanceRef.current += Math.abs(deltaY);
        if (
          !visibleRef.current &&
          upwardDistanceRef.current >= upwardThreshold
        ) {
          visibleRef.current = true;
          setIsVisible(true);
        }
      }
    };

    lastScrollYRef.current = window.scrollY;
    const unsubscribe = subscribeWindowRaf(updateVisibility, {
      scroll: true,
      resize: true,
    });
    return () => {
      unsubscribe();
    };
  }, [heroSelector, upwardThreshold, visibleOverride]);

  useEffect(() => {
    if (visibleOverride === false) {
      setMenuOpen(false);
    }
  }, [visibleOverride]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav
      className={`${styles.fabArea} ${effectiveVisible ? styles.fabAreaVisible : styles.fabAreaHidden} ${rootClassName ?? ""}`}
      style={rootStyle}
    >
      <button
        type="button"
        ref={buttonRef}
        className={styles.fabButton}
        onClick={() => setMenuOpen((prev) => !prev)}
        aria-expanded={menuOpen}
        aria-controls={menuId}
        aria-label={menuLabel}
      >
        <img
          src="/logo-inv.png"
          alt=""
          aria-hidden="true"
          className={styles.fabLogo}
        />
      </button>
      <div
        id={menuId}
        ref={menuRef}
        className={`${styles.fabMenu} ${menuVisible ? styles.fabMenuOpen : ""}`}
        aria-hidden={!menuVisible}
      >
        {menuItems.map((item) => {
          return (
            <a
              key={item.href}
              href={item.href}
              onClick={closeMenu}
              className={styles.menuItem}
              data-label={item.label}
              title={item.label}
              aria-label={item.label}
            >
              <span className={styles.menuItemText}>{item.label}</span>
            </a>
          );
        })}
        {onToggleLanguage ? (
          <button
            type="button"
            className={styles.menuAction}
            onClick={() => {
              onToggleLanguage();
              closeMenu();
            }}
            aria-label={languageAriaLabel}
          >
            {languageLabel}: {language === "en" ? "English" : "日本語"}
          </button>
        ) : null}
      </div>
    </nav>
  );
}
