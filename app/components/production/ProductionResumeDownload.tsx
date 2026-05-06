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
  return (
    <section className={styles.resumeDownloadWrap} aria-label={heading}>
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
