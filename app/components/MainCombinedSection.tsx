import { useLanguage } from "../lib/LanguageContext";
import AboutStyles from "../pages/about/About.module.css";
import ReelsStyles from "../pages/reels/Reels.module.css";
import ContactStyles from "../pages/contact/Contact.module.css";
import FrameStyles from "./PageFrame.module.css";
import { motion } from "motion/react";

import selfyUrl from "../../src/assets/profile_selfy.png";
import iconEmailUrl from "../../src/assets/icon_email.svg";
import iconGithubUrl from "../../src/assets/icon_github.svg";
import iconLinkedinUrl from "../../src/assets/icon_linkedin.svg";
import iconTwitterUrl from "../../src/assets/icon_twitter.svg";
import toolUe4 from "../../src/assets/tool_ue4.svg";
import toolUnity from "../../src/assets/tool_unity.svg";
import toolMaya from "../../src/assets/tool_maya.svg";
import toolHoudini from "../../src/assets/tool_houdini.svg";
import toolZbrush from "../../src/assets/tool_zbrush.svg";
import toolBlender from "../../src/assets/tool_blender.svg";
import toolPainter from "../../src/assets/tool_painter.svg";
import toolDesigner from "../../src/assets/tool_designer.svg";
import toolDocker from "../../src/assets/tool_docker.svg";
import toolAi from "../../src/assets/tool_ai.svg";
import toolLightroom from "../../src/assets/tool_lightroom.svg";
import toolPs from "../../src/assets/tool_ps.svg";
import toolAe from "../../src/assets/tool_ae.svg";
import toolPr from "../../src/assets/tool_pr.svg";
import toolXd from "../../src/assets/tool_xd.svg";
import toolP4 from "../../src/assets/tool_p4.svg";
import toolGit from "../../src/assets/tool_git.svg";
import toolJenkins from "../../src/assets/tool_jenkins.svg";
import langOpengl from "../../src/assets/lang_opengl.svg";
import langHlsl from "../../src/assets/lang_hlsl.svg";
import langMaya from "../../src/assets/lang_maya.svg";
import langReact from "../../src/assets/lang_react.svg";

const toolIcons = [
  toolUe4, toolUnity, toolMaya, toolHoudini, toolZbrush, toolBlender, toolPainter,
  toolDesigner, toolDocker, toolAi, toolLightroom, toolPs, toolAe, toolPr, toolXd,
  toolP4, toolGit, toolJenkins
];

const languageIcons = [langOpengl, langHlsl, langMaya, langReact];

function AboutPanel({ title, body }: { title: string; body: string }) {
  return (
    <section className={AboutStyles.panel}>
      <h3 className={AboutStyles.subTitle}>{title}</h3>
      <hr className={AboutStyles.divider} />
      <p className={AboutStyles.body}>{body}</p>
    </section>
  );
}

type Reel = { id: number; period: string; title: string; description: string; youtubeId: string; };

function ReelCard({ reel }: { reel: Reel }) {
  return (
    <article className={ReelsStyles.card}>
      <div className={ReelsStyles.player}>
        <iframe width="100%" height="100%" src={`https://www.youtube.com/embed/${reel.youtubeId}`} title={reel.title} frameBorder={0} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen />
      </div>
      <div className={ReelsStyles.body}>
        <div className={ReelsStyles.period}>{reel.period}</div>
        <h2 className={ReelsStyles.title}>{reel.title}</h2>
        <p className={ReelsStyles.description}>{reel.description}</p>
      </div>
    </article>
  );
}

export function MainCombinedSection() {
  const { t } = useLanguage();
  const hobbies = t("about_hobbies_list");
  const email = String(t("contact_email_plain"));

  const reels: Reel[] = [
    { id: 1, period: "2022-2024", title: String(t("reels_2022_2024")), description: String(t("reels_2022_2024_desc")), youtubeId: "pMOKLQ0rxhU" },
    { id: 2, period: "2017-2022", title: String(t("reels_2017_2022")), description: String(t("reels_2017_2022_desc")), youtubeId: "L2ci7xq4EEk" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6rem", paddingBottom: "8rem", width: "100%", maxWidth: "860px", margin: "0 auto", position: "relative", zIndex: 10, padding: "0 1rem" }}>
      {/* ABOUT */}
      <motion.section className={FrameStyles.page} initial={{ opacity: 0, filter: "blur(20px)", y: 20 }} whileInView={{ opacity: 1, filter: "blur(0px)", y: 0 }} viewport={{ once: false, margin: "-10%" }} transition={{ duration: 0.8 }}>
        <h1 className={FrameStyles.title} style={{ marginTop: "2rem" }}>{t("about_title")}</h1>
        <div className={AboutStyles.wrap}>
          <section className={AboutStyles.intro}>
            <p>{t("about_greeting")}</p>
            <a href="/resume_en.pdf" className={AboutStyles.resumeBtn}>{t("about_resume")}</a>
          </section>
          <h2 className={AboutStyles.sectionTitle}>{t("about_section_title2")}</h2>
          <section className={`${AboutStyles.panel} ${AboutStyles.profile}`}>
            <img src={selfyUrl} alt="profile selfy" className={AboutStyles.selfy} />
            <h3 className={AboutStyles.profileName}>{t("about_profile_name")}</h3>
            <p className={AboutStyles.profileContact}>{t("about_profile_contact")}</p>
            <div className={AboutStyles.socialRow}>
              <a href={`mailto:${email}`} aria-label="email"><img src={iconEmailUrl} alt="email icon" /></a>
              <a href="https://github.com/testkun08080" target="_blank" rel="noreferrer" aria-label="github"><img src={iconGithubUrl} alt="github icon" /></a>
              <a href="https://linkedin.com/in/testkun08080" target="_blank" rel="noreferrer" aria-label="linkedin"><img src={iconLinkedinUrl} alt="linkedin icon" /></a>
              <a href="https://twitter.com/testkun08080" target="_blank" rel="noreferrer" aria-label="x"><img src={iconTwitterUrl} alt="x icon" /></a>
            </div>
          </section>
          <AboutPanel title={String(t("about_qualifications_title"))} body={String(t("about_qualifications_desc"))} />
          <div className={AboutStyles.columns}>
            <section className={AboutStyles.panel}><h3 className={AboutStyles.subTitle}>{t("about_tools_title")}</h3><hr className={AboutStyles.divider} /><div className={AboutStyles.iconGrid}>{toolIcons.map((url) => (<img key={url} src={url} alt="tool icon" />))}</div></section>
            <section className={AboutStyles.panel}><h3 className={AboutStyles.subTitle}>{t("about_programming_title")}</h3><hr className={AboutStyles.divider} /><div className={AboutStyles.iconGrid}>{languageIcons.map((url) => (<img key={url} src={url} alt="language icon" />))}</div></section>
            <section className={AboutStyles.panel}><h3 className={AboutStyles.subTitle}>{t("about_hobbies_title")}</h3><hr className={AboutStyles.divider} /><ul className={AboutStyles.hobbies}>{Array.isArray(hobbies) && hobbies.map((item) => (<li key={item} className="text-slate-900">{item}</li>))}</ul></section>
          </div>
        </div>
      </motion.section>

      {/* REELS */}
      <motion.section className={FrameStyles.page} initial={{ opacity: 0, filter: "blur(20px)", y: 20 }} whileInView={{ opacity: 1, filter: "blur(0px)", y: 0 }} viewport={{ once: false, margin: "-10%" }} transition={{ duration: 0.8 }}>
        <h1 className={FrameStyles.title}>{t("reels_title")}</h1>
        <div className={ReelsStyles.grid}>
          {reels.map((reel) => (<ReelCard key={reel.id} reel={reel} />))}
        </div>
      </motion.section>

      {/* CONTACT */}
      <motion.section className={FrameStyles.page} initial={{ opacity: 0, filter: "blur(20px)", y: 20 }} whileInView={{ opacity: 1, filter: "blur(0px)", y: 0 }} viewport={{ once: false, margin: "-10%" }} transition={{ duration: 0.8 }}>
        <h1 className={FrameStyles.title}>{t("contact_title")}</h1>
        <section className={ContactStyles.card}>
          <p className={ContactStyles.contactText}>{t("contact_info")}</p>
          <a href={`mailto:${email}`} className="rounded-full bg-[#d9d9d9] px-7 py-2 font-semibold text-black" style={{ display: 'inline-block', marginBottom: '1rem', textDecoration: 'none' }}>{email}</a>
          <div className={ContactStyles.icons} style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <a href={`mailto:${email}`} aria-label="email"><img src={iconEmailUrl} alt="email icon" /></a>
            <a href="https://github.com/testkun08080" target="_blank" rel="noreferrer" aria-label="github"><img src={iconGithubUrl} alt="github icon" /></a>
            <a href="https://linkedin.com/in/testkun08080" target="_blank" rel="noreferrer" aria-label="linkedin"><img src={iconLinkedinUrl} alt="linkedin icon" /></a>
            <a href="https://twitter.com/testkun08080" target="_blank" rel="noreferrer" aria-label="x"><img src={iconTwitterUrl} alt="x icon" /></a>
          </div>
        </section>
      </motion.section>
    </div>
  );
}
