import {
  getSunabaProjectsByCategory,
  type SunabaProjectCategory,
} from "../../lib/sunabaProjects";
import { useLanguage } from "../../lib/LanguageContext";
import { SunabaProjectCard } from "./SunabaProjectCard";
import styles from "./SunabaBoard.module.css";

function ProjectSection({
  category,
  heading,
}: {
  category: SunabaProjectCategory;
  heading: string;
}) {
  const projects = getSunabaProjectsByCategory(category);
  if (!projects.length) return null;

  return (
    <section className={styles.section} aria-labelledby={`sunaba-${category}`}>
      <h2 id={`sunaba-${category}`} className={styles.sectionHeading}>
        {heading}
      </h2>
      <ul className={styles.grid}>
        {projects.map((project) => (
          <li key={project.id} className={styles.item}>
            <SunabaProjectCard project={project} />
          </li>
        ))}
      </ul>
    </section>
  );
}

export function SunabaBoard() {
  const { t } = useLanguage();
  const web = getSunabaProjectsByCategory("web");
  const game = getSunabaProjectsByCategory("game");

  if (!web.length && !game.length) {
    return <p className={styles.empty}>{t("sunaba_empty")}</p>;
  }

  return (
    <div className={styles.board}>
      <ProjectSection
        category="game"
        heading={String(t("sunaba_section_game"))}
      />
      <ProjectSection
        category="web"
        heading={String(t("sunaba_section_web"))}
      />
    </div>
  );
}

