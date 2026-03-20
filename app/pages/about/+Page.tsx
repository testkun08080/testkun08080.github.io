import { PageFrame } from "../../components/PageFrame";
import { useLanguage } from "../../lib/LanguageContext";
import styles from "./About.module.css";

const selfyUrl = new URL("../../../src/assets/profile_selfy.png", import.meta.url).href;
const iconEmailUrl = new URL("../../../src/assets/icon_email.svg", import.meta.url).href;
const iconGithubUrl = new URL("../../../src/assets/icon_github.svg", import.meta.url).href;
const iconLinkedinUrl = new URL("../../../src/assets/icon_linkedin.svg", import.meta.url).href;
const iconTwitterUrl = new URL("../../../src/assets/icon_twitter.svg", import.meta.url).href;

const toolIcons = [
  "tool_ue4.svg",
  "tool_unity.svg",
  "tool_maya.svg",
  "tool_houdini.svg",
  "tool_zbrush.svg",
  "tool_blender.svg",
  "tool_painter.svg",
  "tool_designer.svg",
  "tool_docker.svg",
  "tool_ai.svg",
  "tool_lightroom.svg",
  "tool_ps.svg",
  "tool_ae.svg",
  "tool_pr.svg",
  "tool_xd.svg",
  "tool_p4.svg",
  "tool_git.svg",
  "tool_jenkins.svg",
].map((name) => new URL(`../../../src/assets/${name}`, import.meta.url).href);

const languageIcons = ["lang_opengl.svg", "lang_hlsl.svg", "lang_maya.svg", "lang_react.svg"].map(
  (name) => new URL(`../../../src/assets/${name}`, import.meta.url).href,
);

function AboutPanel({ title, body }: { title: string; body: string }) {
  return (
    <section className={styles.panel}>
      <h3 className={styles.subTitle}>{title}</h3>
      <hr className={styles.divider} />
      <p className={styles.body}>{body}</p>
    </section>
  );
}

export default function Page() {
  const { t } = useLanguage();
  const hobbies = t("about_hobbies_list");
  const email = String(t("contact_email_plain"));

  return (
    <PageFrame titleKey="about_title">
      <div className={styles.wrap}>
        <section className={styles.intro}>
          <p>{t("about_greeting")}</p>
          <a
            href="/resume_en.pdf"
            className={styles.resumeBtn}
          >
            {t("about_resume")}
          </a>
        </section>

        <h2 className={styles.sectionTitle}>{t("about_section_title2")}</h2>

        <section className={`${styles.panel} ${styles.profile}`}>
          <img src={selfyUrl} alt="profile selfy" className={styles.selfy} />
          <h3 className={styles.profileName}>{t("about_profile_name")}</h3>
          <p className={styles.profileContact}>{t("about_profile_contact")}</p>
          <div className={styles.socialRow}>
            <a href={`mailto:${email}`} aria-label="email">
              <img src={iconEmailUrl} alt="email icon" />
            </a>
            <a href="https://github.com/testkun08080" target="_blank" rel="noreferrer" aria-label="github">
              <img src={iconGithubUrl} alt="github icon" />
            </a>
            <a
              href="https://linkedin.com/in/testkun08080"
              target="_blank"
              rel="noreferrer"
              aria-label="linkedin"
            >
              <img src={iconLinkedinUrl} alt="linkedin icon" />
            </a>
            <a href="https://twitter.com/testkun08080" target="_blank" rel="noreferrer" aria-label="x">
              <img src={iconTwitterUrl} alt="x icon" />
            </a>
          </div>
        </section>

        <AboutPanel
          title={String(t("about_qualifications_title"))}
          body={String(t("about_qualifications_desc"))}
        />

        <div className={styles.columns}>
          <section className={styles.panel}>
            <h3 className={styles.subTitle}>{t("about_tools_title")}</h3>
            <hr className={styles.divider} />
            <div className={styles.iconGrid}>
              {toolIcons.map((url) => (
                <img key={url} src={url} alt="tool icon" />
              ))}
            </div>
          </section>
          <section className={styles.panel}>
            <h3 className={styles.subTitle}>{t("about_programming_title")}</h3>
            <hr className={styles.divider} />
            <div className={styles.iconGrid}>
              {languageIcons.map((url) => (
                <img key={url} src={url} alt="language icon" />
              ))}
            </div>
          </section>
          <section className={styles.panel}>
            <h3 className={styles.subTitle}>{t("about_hobbies_title")}</h3>
            <hr className={styles.divider} />
            <ul className={styles.hobbies}>
              {Array.isArray(hobbies) &&
                hobbies.map((item) => (
                  <li key={item} className="text-slate-900">
                    {item}
                  </li>
                ))}
            </ul>
          </section>
        </div>

      </div>
    </PageFrame>
  );
}
