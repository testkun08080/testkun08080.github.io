import { animate, createScope, onScroll } from "animejs";
import { useEffect, useRef } from "react";
import { animateFadeSlideReveal } from "../../lib/scrollRunOnce";
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
  const scopeRef = useRef<ReturnType<typeof createScope> | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    scopeRef.current = createScope({ root }).add(() => {
      animateFadeSlideReveal(animate, onScroll, root, {
        enter: "bottom top",
        leave: "center center",
      });
    });

    return () => {
      scopeRef.current?.revert();
      scopeRef.current = null;
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
