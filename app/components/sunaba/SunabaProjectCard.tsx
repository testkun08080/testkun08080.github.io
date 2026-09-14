import type { CSSProperties } from "react";
import { pickLocalized, type SunabaProject } from "../../lib/sunabaProjects";
import { useLanguage } from "../../lib/LanguageContext";
import styles from "./SunabaProjectCard.module.css";

type Props = {
  project: SunabaProject;
  style?: CSSProperties;
  className?: string;
};

export function SunabaProjectCard({ project, style, className }: Props) {
  const { language, t } = useLanguage();
  const title = pickLocalized(project.title, language);
  const description = pickLocalized(project.description, language);
  const isExternal =
    project.external ?? /^https?:\/\//.test(project.href);
  const statusLabel =
    project.status === "live"
      ? t("sunaba_status_live")
      : project.status === "wip"
        ? t("sunaba_status_wip")
        : null;

  return (
    <a
      href={project.href}
      className={[styles.card, className].filter(Boolean).join(" ")}
      style={style}
      {...(isExternal
        ? { target: "_blank", rel: "noopener noreferrer" }
        : undefined)}
    >
      <div className={styles.header}>
        {project.icon ? (
          <img
            src={project.icon}
            alt=""
            className={styles.icon}
            width={40}
            height={40}
            loading="lazy"
          />
        ) : null}
        <h2 className={styles.title}>{title}</h2>
        {statusLabel ? (
          <span
            className={[
              styles.status,
              project.status === "live" ? styles.statusLive : styles.statusWip,
            ].join(" ")}
          >
            {String(statusLabel)}
          </span>
        ) : null}
      </div>
      <p className={styles.description}>{description}</p>
    </a>
  );
}
