import { animate, createScope, onScroll, stagger } from "animejs";
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
  const pageRef = useRef<HTMLDivElement>(null);
  const scopeRef = useRef<ReturnType<typeof createScope> | null>(null);
  const gridRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [expandedMap, setExpandedMap] = useState<Record<string, boolean>>({});
  const [overflowMap, setOverflowMap] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const page = pageRef.current;
    if (!page) return;
    const categorySections = Array.from(
      page.querySelectorAll<HTMLElement>(`.${styles.iconSection}`),
    );

    const cards = Array.from(
      page.querySelectorAll<HTMLElement>("[data-tool-card]"),
    );
    if (!cards.length || !categorySections.length) return;

    scopeRef.current = createScope({ root: page }).add(() => {
      categorySections.forEach((section) => {
        animate(section, {
          opacity: [0, 1],
          translateY: ["40px", "0px"],
          autoplay: onScroll({
            enter: "bottom top",
            leave: "center center",
            sync: true,
          }),
        });
      });
    });

    const drift = animate(cards, {
      translateY: ["0px", "-4px"],
      rotate: ["0deg", "1.2deg"],
      duration: 2400,
      delay: stagger(50, { from: "center" }),
      ease: "inOut(3)",
      loop: true,
      debug: false,
      alternate: true,
    });

    // const scrollSyncProxy = { progress: 0 };
    // const scrollSync = animate(scrollSyncProxy, {
    //   progress: 1,
    //   duration: 1,
    //   ease: "linear",
    //   autoplay: onScroll({
    //     target: page,
    //     enter: "top bottom",
    //     leave: "center center",
    //     sync: true,
    //     onUpdate: (self) => {
    //       const observer = self as { progress?: number };
    //       if (typeof observer.progress !== "number") return;
    //       if (observer.progress > 0.01 && observer.progress < 0.99) {
    //         drift.play();
    //       } else {
    //         drift.pause();
    //       }
    //     },
    //   }),
    // });

    const pointerCleanups = cards.map((card) => {
      const handlePointerDown = () => {
        animate(card, {
          scale: [1, 0.93, 1.02, 1],
          rotate: ["0deg", "-2deg", "1.6deg", "0deg"],
          duration: 380,
          ease: "out(5)",
          debug: false,
        });
      };
      card.addEventListener("pointerdown", handlePointerDown);
      return () => card.removeEventListener("pointerdown", handlePointerDown);
    });

    return () => {
      scopeRef.current?.revert();
      scopeRef.current = null;
      // scrollSync.revert();
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
    <div ref={pageRef} className={styles.page}>
      {TOOL_CATEGORIES.map((category) => (
        <section key={category.id} className={styles.iconSection}>
          <h2 className={styles.sectionTitle}>{category.title}</h2>
          <div
            className={`${styles.iconGridShell} ${
              overflowMap[category.id] && !expandedMap[category.id]
                ? styles.iconGridFadeHint
                : ""
            }`}
          >
            <div
              id={`tools-grid-${category.id}`}
              className={`${styles.iconGridViewport} ${
                overflowMap[category.id]
                  ? styles.iconGridViewportCollapsible
                  : ""
              } ${
                overflowMap[category.id] && !expandedMap[category.id]
                  ? styles.iconGridViewportCollapsed
                  : ""
              } ${
                expandedMap[category.id] ? styles.iconGridViewportExpanded : ""
              }`}
            >
              <div
                ref={(node) => {
                  gridRefs.current[category.id] = node;
                }}
                className={`${styles.iconGrid} ${category.id === "languages" ? styles.iconGridLanguages : ""}`}
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
                {expandedMap[category.id] ? closeLabel : showMoreLabel}
              </button>
            </div>
          ) : null}
        </section>
      ))}
    </div>
  );
}
