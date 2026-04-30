import { animate, createScope, onScroll, stagger } from "animejs";
import { useEffect, useRef, useState } from "react";
import styles from "./DevSiteStructureSample.module.css";

const FLOW_TEXT =
  "SHADER LOGO  •  MOTION TYPE  •  CREATIVE CODING  •  SCROLL STORY  •  ";

const SECTION_ITEMS = [
  { id: "greeting", title: "Greeting", body: "こんにちは。ここは短い挨拶を置くセクション。" },
  { id: "about", title: "About", body: "自己紹介や考え方、得意な領域をまとめるセクション。" },
  { id: "work", title: "Work", body: "代表作をシンプルに並べるセクション。" },
  { id: "skills", title: "Skills", body: "ツールや技術スタックを表示するセクション。" },
  { id: "contact", title: "Contact", body: "連絡先やフォームへの導線を置くセクション。" },
] as const;

export default function Page() {
  const [menuOpen, setMenuOpen] = useState(false);
  const rootRef = useRef<HTMLElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const scopeRef = useRef<ReturnType<typeof createScope> | null>(null);
  const reduceMotionRef = useRef(false);

  useEffect(() => {
    if (!rootRef.current) return;

    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    reduceMotionRef.current = reduced;

    if (reduced) return;

    scopeRef.current = createScope({ root: rootRef.current }).add(() => {
      animate(`.${styles.heroInner}`, {
        opacity: [0, 1],
        translateY: [28, 0],
        duration: 900,
        ease: "out(3)",
      });

      animate(`.${styles.flowText}`, {
        translateX: ["0%", "-50%"],
        duration: 22000,
        ease: "linear",
        loop: true,
      });

      animate(`.${styles.reveal}`, {
        opacity: [0, 1],
        translateY: [24, 0],
        delay: stagger(80),
        ease: "linear",
        autoplay: onScroll({
          target: `.${styles.content}`,
          enter: "top bottom",
          leave: "bottom top",
          sync: true,
        }),
      });
    });

    return () => {
      scopeRef.current?.revert();
      scopeRef.current = null;
    };
  }, []);

  useEffect(() => {
    const button = buttonRef.current;
    const menu = menuRef.current;
    if (!button || !menu || reduceMotionRef.current) return;

    animate(button, {
      scale: [1, 0.92, 1.06, 1],
      rotate: menuOpen ? ["0deg", "4deg", "0deg"] : ["0deg", "-3deg", "0deg"],
      duration: 420,
      ease: "out(4)",
    });

    if (menuOpen) {
      const links = menu.querySelectorAll("a");
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
    } else {
      animate(menu, {
        opacity: [1, 0],
        scale: [1, 0.92],
        translateY: [0, 8],
        duration: 180,
        ease: "in(2)",
      });
    }
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <main ref={rootRef} className={styles.page}>
      <header className={styles.header}>
        <a href="#hero" className={styles.brand}>
          testkun08080
        </a>
      </header>

      <section id="hero" className={styles.hero}>
        <div className={styles.heroInner}>
          <p className={styles.kicker}>Hero</p>
          <h1 className={styles.logo}>Shader Logo</h1>
          <p className={styles.heroCopy}>中央ロゴ + 周辺テキストアニメのサンプル</p>
        </div>
        <div className={styles.flowWrap}>
          <span className={styles.flowText}>
            {FLOW_TEXT}
            {FLOW_TEXT}
          </span>
        </div>
      </section>

      <section className={styles.content}>
        {SECTION_ITEMS.map((section) => (
          <article key={section.id} id={section.id} className={`${styles.block} ${styles.reveal}`}>
            <p className={styles.blockLabel}>{section.id}</p>
            <h2 className={styles.blockTitle}>{section.title}</h2>
            <p className={styles.blockBody}>{section.body}</p>
          </article>
        ))}
      </section>

      <footer id="footer" className={styles.footer}>
        <p>Footer</p>
      </footer>

      <nav className={styles.fabArea}>
        <button
          type="button"
          ref={buttonRef}
          className={styles.fabButton}
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-expanded={menuOpen}
          aria-controls="quick-menu"
        >
          Menu
        </button>
        <div
          id="quick-menu"
          ref={menuRef}
          className={`${styles.fabMenu} ${menuOpen ? styles.fabMenuOpen : ""}`}
          aria-hidden={!menuOpen}
        >
          <a href="#work" onClick={closeMenu}>
            work
          </a>
          <a href="#about" onClick={closeMenu}>
            about
          </a>
          <a href="#contact" onClick={closeMenu}>
            contact
          </a>
        </div>
      </nav>
    </main>
  );
}
