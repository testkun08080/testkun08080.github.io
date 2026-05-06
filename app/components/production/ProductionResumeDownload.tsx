import { animate, onScroll } from "animejs";
import { useEffect, useRef } from "react";
import styles from "./ProductionResumeDownload.module.css";

type ProductionResumeDownloadProps = {
  heading: string;
  resumeJaLabel: string;
  resumeEnLabel: string;
  downloadLabel: string;
};

export function ProductionResumeDownload({
  heading,
  resumeJaLabel,
  resumeEnLabel,
  downloadLabel,
}: ProductionResumeDownloadProps) {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    root.style.opacity = "0";
    root.style.transform = "translateY(40px)";

    const anim = animate(root, {
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
      anim.revert();
    };
  }, []);

  return (
    <section ref={rootRef} className={styles.resumeDownloadWrap} aria-label={heading}>
      <h3 className={styles.resumeDownloadHeading}>{heading}</h3>
      <div className={styles.resumeDownloadButtons}>
        <a
          className={styles.resumeDownloadButton}
          href="/resume/resume_ja.pdf"
          download
        >
          {resumeJaLabel} {downloadLabel}
        </a>
        <a
          className={styles.resumeDownloadButton}
          href="/resume/resume_en.pdf"
          download
        >
          {resumeEnLabel} {downloadLabel}
        </a>
      </div>
    </section>
  );
}
