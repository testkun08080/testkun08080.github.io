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
  const { language } = useLanguage();
  const title = pickLocalized(project.title, language);
  const description = pickLocalized(project.description, language);
  const isExternal =
    project.external ?? /^https?:\/\//.test(project.href);

  return (
    <a
      href={project.href}
      className={[styles.card, className].filter(Boolean).join(" ")}
      style={style}
      {...(isExternal
        ? { target: "_blank", rel: "noopener noreferrer" }
        : undefined)}
    >
      <h2 className={styles.title}>{title}</h2>
      <p className={styles.description}>{description}</p>
    </a>
  );
}
