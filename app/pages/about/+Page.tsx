import { PageFrame } from "../../components/PageFrame";
import { useLanguage } from "../../lib/LanguageContext";
import styles from "./About.module.css";
import selfyUrl from "../../../src/assets/profile_selfy.png";
import iconEmailUrl from "../../../src/assets/icon_email.svg";
import iconGithubUrl from "../../../src/assets/icon_github.svg";
import iconLinkedinUrl from "../../../src/assets/icon_linkedin.svg";
import iconTwitterUrl from "../../../src/assets/icon_twitter.svg";
import toolUe4 from "../../../src/assets/tool_ue4.svg";
import toolUnity from "../../../src/assets/tool_unity.svg";
import toolMaya from "../../../src/assets/tool_maya.svg";
import toolHoudini from "../../../src/assets/tool_houdini.svg";
import toolZbrush from "../../../src/assets/tool_zbrush.svg";
import toolBlender from "../../../src/assets/tool_blender.svg";
import toolPainter from "../../../src/assets/tool_painter.svg";
import toolDesigner from "../../../src/assets/tool_designer.svg";
import toolDocker from "../../../src/assets/tool_docker.svg";
import toolAi from "../../../src/assets/tool_ai.svg";
import toolLightroom from "../../../src/assets/tool_lightroom.svg";
import toolPs from "../../../src/assets/tool_ps.svg";
import toolAe from "../../../src/assets/tool_ae.svg";
import toolPr from "../../../src/assets/tool_pr.svg";
import toolXd from "../../../src/assets/tool_xd.svg";
import toolP4 from "../../../src/assets/tool_p4.svg";
import toolGit from "../../../src/assets/tool_git.svg";
import toolJenkins from "../../../src/assets/tool_jenkins.svg";
import langOpengl from "../../../src/assets/lang_opengl.svg";
import langHlsl from "../../../src/assets/lang_hlsl.svg";
import langMaya from "../../../src/assets/lang_maya.svg";
import langReact from "../../../src/assets/lang_react.svg";

const toolIcons = [
  toolUe4,
  toolUnity,
  toolMaya,
  toolHoudini,
  toolZbrush,
  toolBlender,
  toolPainter,
  toolDesigner,
  toolDocker,
  toolAi,
  toolLightroom,
  toolPs,
  toolAe,
  toolPr,
  toolXd,
  toolP4,
  toolGit,
  toolJenkins,
];

const languageIcons = [langOpengl, langHlsl, langMaya, langReact];

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
