import { animate, createScope, onScroll } from "animejs";
import { useEffect, useRef } from "react";
import styles from "../../pages/dev-reels/DevHogehoge.module.css";

const REELS = [
  {
    label: "Reel 01",
    period: "2022 - 2024",
    embedUrl: "https://www.youtube.com/embed/pMOKLQ0rxhU?rel=0&playsinline=1",
  },
  {
    label: "Reel 02",
    period: "2017 - 2022",
    embedUrl: "https://www.youtube.com/embed/L2ci7xq4EEk?rel=0&playsinline=1",
  },
] as const;

export function WorkReelsSection() {
  const rootRef = useRef<HTMLElement>(null);
  const scopeRef = useRef<ReturnType<typeof createScope> | null>(null);

  useEffect(() => {
    if (!rootRef.current) return;

    scopeRef.current = createScope({ root: rootRef.current }).add(() => {
      animate(`.${styles.reelCard}`, {
        opacity: [0.2, 1],
        translateY: [48, 0],
        ease: "linear",
        autoplay: onScroll({
          target: `.${styles.reelSection}`,
          enter: "top bottom",
          leave: "bottom center",
          sync: true,
        }),
      });
    });

    return () => {
      scopeRef.current?.revert();
      scopeRef.current = null;
    };
  }, []);

  return (
    <main ref={rootRef} className={styles.page}>
      {REELS.map((reel) => (
        <section key={reel.label} className={styles.reelSection}>
          <div className={styles.reelCard}>
            <p className={styles.reelLabel}>{reel.label}</p>
            <h2 className={styles.reelPeriod}>{reel.period}</h2>
            <div className={styles.videoFrame} style={{ background: "transparent" }}>
              <iframe
                src={reel.embedUrl}
                title={`${reel.label} ${reel.period}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </section>
      ))}
    </main>
  );
}
