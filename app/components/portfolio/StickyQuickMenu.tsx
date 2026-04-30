import { animate } from "animejs";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import styles from "./StickyQuickMenu.module.css";

type StickyQuickMenuItem = {
  href: string;
  label: string;
};

type StickyQuickMenuProps = {
  items: StickyQuickMenuItem[];
  heroSelector?: string;
  upwardThreshold?: number;
  language?: "ja" | "en";
  onToggleLanguage?: () => void;
};

export function StickyQuickMenu({
  items,
  heroSelector = "#hero",
  upwardThreshold = 10,
  language,
  onToggleLanguage,
}: StickyQuickMenuProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const menuId = useId();
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const lastScrollYRef = useRef(0);
  const upwardDistanceRef = useRef(0);
  const visibleRef = useRef(false);
  const rafIdRef = useRef(0);

  const menuItems = useMemo(() => items, [items]);

  useEffect(() => {
    const button = buttonRef.current;
    const menu = menuRef.current;
    if (!button || !menu) return;

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
        delay: (_el, i) => i * 55,
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
  }, [menuOpen]);

  useEffect(() => {
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
        if (!visibleRef.current && upwardDistanceRef.current >= upwardThreshold) {
          visibleRef.current = true;
          setIsVisible(true);
        }
      }
    };

    const onScroll = () => {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = requestAnimationFrame(updateVisibility);
    };

    lastScrollYRef.current = window.scrollY;
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(rafIdRef.current);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [heroSelector, upwardThreshold]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className={`${styles.fabArea} ${isVisible ? styles.fabAreaVisible : styles.fabAreaHidden}`}>
      <button
        type="button"
        ref={buttonRef}
        className={styles.fabButton}
        onClick={() => setMenuOpen((prev) => !prev)}
        aria-expanded={menuOpen}
        aria-controls={menuId}
      >
        Menu
      </button>
      <div
        id={menuId}
        ref={menuRef}
        className={`${styles.fabMenu} ${menuOpen ? styles.fabMenuOpen : ""}`}
        aria-hidden={!menuOpen}
      >
        {menuItems.map((item) => (
          <a key={item.href} href={item.href} onClick={closeMenu}>
            {item.label}
          </a>
        ))}
        {onToggleLanguage ? (
          <button
            type="button"
            className={styles.menuAction}
            onClick={() => {
              onToggleLanguage();
              closeMenu();
            }}
            aria-label="Switch language between Japanese and English"
          >
            Language: {language === "en" ? "English" : "日本語"}
          </button>
        ) : null}
      </div>
    </nav>
  );
}
