import { animate, createScope, onScroll } from "animejs";
import { useEffect, useRef, useState } from "react";
import styles from "./DevSideCenterAnime.module.css";

const WORDS = [
  "hi there h",
  "white words",
  "side center",
  "scroll move",
  "testkun08080",
  "hello world",
] as const;

const LINE_COUNT = 36;
const START_OFFSET_VW = 33;

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !("matchMedia" in window)) return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  return reduced;
}

export default function Page() {
  const [menuOpen, setMenuOpen] = useState(false);
  const reduceMotion = usePrefersReducedMotion();
  const rootRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const centerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const sideTypingSpansRef = useRef<(HTMLSpanElement | null)[]>([]);
  const scopeRef = useRef<ReturnType<typeof createScope> | null>(null);

  useEffect(() => {
    if (!rootRef.current) return;
    const track = trackRef.current;
    const left = leftRef.current;
    const right = rightRef.current;
    const center = centerRef.current;
    if (!track || !left || !right || !center) return;

    if (reduceMotion) {
      left.style.transform = "translate3d(0, 0, 0)";
      right.style.transform = "translate3d(0, 0, 0)";
      center.style.opacity = "1";
      center.style.transform = "translateY(0)";
      sideTypingSpansRef.current.forEach((span) => {
        if (!span) return;
        span.style.width = "100%";
        span.style.borderRightWidth = "0";
      });
      return;
    }

    scopeRef.current = createScope({ root: rootRef.current }).add(() => {
      animate(left, {
        translateX: [`${START_OFFSET_VW}vw`, "0vw"],
        ease: "linear",
        autoplay: onScroll({
          target: track,
          enter: "bottom top",
          leave: "center top",
          sync: true,
          debug: true,
        }),
      });

      animate(right, {
        translateX: [`-${START_OFFSET_VW}vw`, "0vw"],
        scaleX: [-1, -1],
        ease: "linear",
        autoplay: onScroll({
          target: track,
          enter: "bottom top",
          leave: "center top",
          sync: true,
          debug: true,
        }),
      });

      animate(center, {
        opacity: [0, 1],
        translateY: [24, 0],
        ease: "linear",
        autoplay: onScroll({
          target: track,
          enter: "top+=20% top",
          leave: "top+=65% top",
          sync: true,
        }),
      });

      sideTypingSpansRef.current.forEach((span, i) => {
        if (!span) return;
        const chars = (span.textContent?.length ?? 12) + 1;
        const baseDelay =
          i < LINE_COUNT ? (i % 8) * 100 : ((i - LINE_COUNT) % 8) * 120;
        animate(span, {
          width: [`0ch`, `${chars}ch`],
          ease: "steps(14)",
          duration: 1100,
          delay: baseDelay,
          loop: true,
          alternate: true,
          loopDelay: 750,
        });
      });
    });

    return () => {
      scopeRef.current?.revert();
      scopeRef.current = null;
    };
  }, [reduceMotion]);

  useEffect(() => {
    const button = buttonRef.current;
    const menu = menuRef.current;
    if (!button || !menu || reduceMotion) return;

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
        delay: (el, i) => i * 55,
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
  }, [menuOpen, reduceMotion]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <main ref={rootRef} className={styles.page}>
      <section id="intro" className={styles.intro}>
        <h1 className={styles.title}>dev-side-center-anime</h1>
        <p className={styles.copy}>
          白文字を左右から中央へ寄せる構成を animejs
          のスクロール同期だけで再現。
        </p>
      </section>

      <section id="side-center" ref={trackRef} className={styles.track}>
        <div className={styles.stickyFrame}>
          <div ref={centerRef} className={styles.centerContent}>
            <h2 className={styles.centerHeading}>konchiwa</h2>
            <div className={styles.centerLine} />
          </div>

          <div
            ref={leftRef}
            className={`${styles.wordBlock} ${styles.leftBlock}`}
          >
            {Array.from({ length: LINE_COUNT }).map((_, i) => (
              <p key={`l-${i}`} className={styles.sideText}>
                <span
                  className={styles.sideTyping}
                  ref={(el) => {
                    sideTypingSpansRef.current[i] = el;
                  }}
                >
                  {WORDS[i % WORDS.length]}
                </span>
              </p>
            ))}
          </div>

          <div
            ref={rightRef}
            className={`${styles.wordBlock} ${styles.rightBlock}`}
          >
            {Array.from({ length: LINE_COUNT }).map((_, i) => (
              <p key={`r-${i}`} className={styles.sideText}>
                <span
                  className={styles.sideTyping}
                  ref={(el) => {
                    sideTypingSpansRef.current[LINE_COUNT + i] = el;
                  }}
                >
                  {WORDS[i % WORDS.length]}
                </span>
              </p>
            ))}
          </div>
        </div>
      </section>

      <section id="outro" className={styles.outro}>
        {Array.from({ length: 3 }).map((_, i) => (
          <p key={i} className={styles.outroText}>
            side locked
          </p>
        ))}
      </section>

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
          <a href="#intro" onClick={closeMenu}>
            intro
          </a>
          <a href="#side-center" onClick={closeMenu}>
            side-center
          </a>
          <a href="#outro" onClick={closeMenu}>
            outro
          </a>
        </div>
      </nav>
    </main>
  );
}
