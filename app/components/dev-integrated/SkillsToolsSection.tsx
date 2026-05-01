import { animate, stagger } from "animejs";
import { useEffect, useRef, useState } from "react";
import styles from "../shared-dev-assets/DevSoftwareTools.module.css";
import { TOOL_CATEGORIES } from "../shared-dev-assets/toolCategories";

type SkillsToolsSectionProps = {
  showMoreLabel?: string;
  closeLabel?: string;
};

export function SkillsToolsSection({
  showMoreLabel = "Show more",
  closeLabel = "Close",
}: SkillsToolsSectionProps) {
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

    const cards = Array.from(
      page.querySelectorAll<HTMLElement>("[data-tool-card]"),
    );
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
      delay: stagger(50, { from: "center" }),
      ease: "inOut(3)",
      loop: true,
      alternate: true,
    });

    // Pause drift animation when section scrolls out of view
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            drift.play();
          } else {
            drift.pause();
          }
        }
      },
      { threshold: 0 },
    );
    io.observe(page);

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
      io.disconnect();
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

        nextOverflowMap[category.id] =
          grid.scrollHeight > COLLAPSED_GRID_MAX_HEIGHT + 2;
      });

      setOverflowMap(nextOverflowMap);
    };

    checkOverflow();

    let resizeTimer = 0;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(checkOverflow, 150);
    };
    window.addEventListener("resize", onResize, { passive: true });
    return () => {
      clearTimeout(resizeTimer);
      window.removeEventListener("resize", onResize);
    };
  }, [expandedMap]);

  const toggleExpanded = (categoryId: string) => {
    setExpandedMap((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };

  return (
    <main ref={pageRef} className={styles.page}>
      {TOOL_CATEGORIES.map((category) => (
        <section key={category.id} className={styles.iconSection}>
          <h2 className={styles.sectionTitle}>{category.title}</h2>
          <div
            id={`tools-grid-${category.id}`}
            ref={(node) => {
              gridRefs.current[category.id] = node;
            }}
            className={`${styles.iconGrid} ${category.id === "languages" ? styles.iconGridLanguages : ""} ${
              expandedMap[category.id] ? styles.iconGridExpanded : ""
            } ${
              overflowMap[category.id] && !expandedMap[category.id]
                ? styles.iconGridFadeHint
                : ""
            }`}
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
                ) : (
                  <span className={styles.fallbackBadge}>TEXT</span>
                )}
                <span className={styles.iconLabel}>{tool.name}</span>
              </button>
            ))}
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
                {expandedMap[category.id] ? closeLabel : showMoreLabel}
              </button>
            </div>
          ) : null}
        </section>
      ))}
    </main>
  );
}
