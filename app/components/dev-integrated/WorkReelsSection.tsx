import { animate, onScroll } from "animejs";
import { useEffect, useRef } from "react";
import styles from "../shared-dev-assets/DevHogehoge.module.css";

const REELS = [
  {
    label: "Reel 01",
    period: "2022 - 2024",
    embedUrl: "https://www.youtube-nocookie.com/embed/pMOKLQ0rxhU?rel=0&playsinline=1",
    watchUrl: "https://www.youtube.com/watch?v=pMOKLQ0rxhU",
  },
  {
    label: "Reel 02",
    period: "2017 - 2022",
    embedUrl: "https://www.youtube-nocookie.com/embed/L2ci7xq4EEk?rel=0&playsinline=1",
    watchUrl: "https://www.youtube.com/watch?v=L2ci7xq4EEk",
  },
] as const;

type WorkReelsSectionProps = {
  fallbackPrefix?: string;
  fallbackLinkLabel?: string;
};

export function WorkReelsSection({
  fallbackPrefix = "埋め込みが表示されない場合は",
  fallbackLinkLabel = "YouTubeで開く",
}: WorkReelsSectionProps) {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReducedMotion) return;

    root.style.opacity = "0";
    root.style.transform = "translateY(40px)";

    const entrance = animate(root, {
      opacity: [0, 1],
      translateY: ["40px", "0px"],
      ease: "linear",
      autoplay: onScroll({
        enter: "top 85%",
        leave: "top 20%",
        sync: true,
      }),
    });

    return () => {
      entrance.revert();
    };
  }, []);

  return (
    <main ref={rootRef} className={styles.page}>
      {REELS.map((reel) => (
        <section key={reel.label} className={styles.reelSection}>
          <div className={styles.reelCard}>
            <p className={styles.reelLabel}>{reel.label}</p>
            <h2 className={styles.reelPeriod}>{reel.period}</h2>
            <div className={styles.videoFrame}>
              <iframe
                src={reel.embedUrl}
                title={`${reel.label} ${reel.period}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>
            <p className={styles.embedFallback}>
              {fallbackPrefix}{" "}
              <a href={reel.watchUrl} target="_blank" rel="noreferrer">
                {fallbackLinkLabel}
              </a>
            </p>
          </div>
        </section>
      ))}
    </main>
  );
}
