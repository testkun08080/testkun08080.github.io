import { animate, stagger } from "animejs";
import { useEffect, useRef, useState } from "react";
import styles from "./DevSoftwareTools.module.css";
import { TOOL_CATEGORIES } from "./toolCategories";

export default function Page() {
  const COLLAPSED_GRID_MAX_HEIGHT = 296;
  const pageRef = useRef<HTMLElement>(null);
  const gridRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [expandedMap, setExpandedMap] = useState<Record<string, boolean>>({});
  const [overflowMap, setOverflowMap] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const page = pageRef.current;
    if (!page) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReducedMotion) return;

    const cards = Array.from(page.querySelectorAll<HTMLElement>("[data-tool-card]"));
    if (!cards.length) return;

    cards.forEach((card) => {
      card.style.opacity = "0.01";
      card.style.transform = "translateY(22px) scale(0.94)";
    });

    const reveal = animate(cards, {
      opacity: [0, 1],
      translateY: [22, 0],
      scale: [0.94, 1],
      duration: 660,
      ease: "out(4)",
      delay: stagger(60),
    });

    const drift = animate(cards, {
      translateY: ["0px", "-4px"],
      rotate: ["0deg", "1.2deg"],
      duration: 2400,
      delay: stagger(95, { from: "center" }),
      ease: "inOut(3)",
      loop: true,
      alternate: true,
    });

    const pointerCleanups = cards.map((card) => {
      const handlePointerDown = () => {
        animate(card, {
          scale: [1, 0.93, 1.02, 1],
          rotate: ["0deg", "-2deg", "1.6deg", "0deg"],
          duration: 380,
          ease: "out(5)",
        });
      };
      card.addEventListener("pointerdown", handlePointerDown);
      return () => card.removeEventListener("pointerdown", handlePointerDown);
    });

    return () => {
      reveal.revert();
      drift.revert();
      pointerCleanups.forEach((cleanup) => cleanup());
    };
  }, []);

  useEffect(() => {
    const checkOverflow = () => {
      const nextOverflowMap: Record<string, boolean> = {};

      TOOL_CATEGORIES.forEach((category) => {
        const grid = gridRefs.current[category.id];
        if (!grid) return;

        nextOverflowMap[category.id] = grid.scrollHeight > COLLAPSED_GRID_MAX_HEIGHT + 2;
      });

      setOverflowMap(nextOverflowMap);
    };

    checkOverflow();

    const resizeObserver = new ResizeObserver(() => {
      checkOverflow();
    });

    TOOL_CATEGORIES.forEach((category) => {
      const grid = gridRefs.current[category.id];
      if (grid) resizeObserver.observe(grid);
    });

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  const toggleExpanded = (categoryId: string) => {
    setExpandedMap((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };

  return (
    <main ref={pageRef} className={styles.page}>
      <section className={styles.hero}>
        <h1 className={styles.title}>Software &amp; tools</h1>
        <p className={styles.description}>
          先ほどの定義カテゴリごとに、既存アイコンがある技術を振り分けています。
        </p>
      </section>

      {TOOL_CATEGORIES.map((category) => (
        <section key={category.id} className={styles.iconSection}>
          <h2 className={styles.sectionTitle}>{category.title}</h2>
          <p className={styles.categoryRole}>
            <span className={styles.categoryLabel}>役割:</span> {category.role}
          </p>
          <div
            className={`${styles.iconGridShell} ${
              overflowMap[category.id] && !expandedMap[category.id] ? styles.iconGridFadeHint : ""
            }`}
          >
            <div
              id={`tools-grid-${category.id}`}
              className={`${styles.iconGridViewport} ${
                expandedMap[category.id] ? styles.iconGridViewportExpanded : ""
              }`}
            >
              <div
                ref={(node) => {
                  gridRefs.current[category.id] = node;
                }}
                className={styles.iconGrid}
              >
                {category.tools.map((tool) => (
                  <button
                    key={tool.name}
                    type="button"
                    data-tool-card
                    className={styles.iconCard}
                    aria-label={`${tool.name} icon`}
                  >
                    {tool.iconPath ? (
                      <img
                        src={tool.iconPath}
                        alt={tool.name}
                        className={styles.iconImage}
                        loading="lazy"
                        draggable={false}
                      />
                    ) : tool.iconEmoji ? (
                      <span
                        className={`${styles.fallbackBadge} ${styles.emojiBadge}`}
                        role="img"
                        aria-label={tool.name}
                      >
                        {tool.iconEmoji}
                      </span>
                    ) : (
                      <span className={styles.fallbackBadge}>TEXT</span>
                    )}
                    <span className={styles.iconLabel}>{tool.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
          {overflowMap[category.id] ? (
            <div className={styles.expandArea}>
              <button
                type="button"
                className={styles.expandButton}
                onClick={() => toggleExpanded(category.id)}
                aria-expanded={Boolean(expandedMap[category.id])}
                aria-controls={`tools-grid-${category.id}`}
              >
                {expandedMap[category.id] ? "閉じる" : "もっと見る"}
              </button>
            </div>
          ) : null}
        </section>
      ))}

      <a
        href="/dev"
        className="mx-auto mt-14 inline-block text-sm text-slate-600 underline underline-offset-4 hover:text-slate-900"
      >
        /dev へ戻る
      </a>
    </main>
  );
}
