import { PageFrame } from "../../components/PageFrame";
import { useLanguage } from "../../lib/LanguageContext";
import styles from "./Contact.module.css";
import iconEmailUrl from "../../../src/assets/icon_email.svg";
import iconGithubUrl from "../../../src/assets/icon_github.svg";
import iconLinkedinUrl from "../../../src/assets/icon_linkedin.svg";
import iconTwitterUrl from "../../../src/assets/icon_twitter.svg";

export default function Page() {
  const { t } = useLanguage();
  const email = String(t("contact_email_plain"));

  return (
    <PageFrame titleKey="contact_title">
      <section className={styles.card}>
        <p className={styles.contactText}>{t("contact_info")}</p>
        <a href={`mailto:${email}`} className="rounded-full bg-[#d9d9d9] px-7 py-2 font-semibold text-black">
          {email}
        </a>
        <div className={styles.icons}>
          <a href={`mailto:${email}`} aria-label="email">
            <img src={iconEmailUrl} alt="email icon" />
          </a>
          <a href="https://github.com/testkun08080" target="_blank" rel="noreferrer" aria-label="github">
            <img src={iconGithubUrl} alt="github icon" />
          </a>
          <a href="https://linkedin.com/in/testkun08080" target="_blank" rel="noreferrer" aria-label="linkedin">
            <img src={iconLinkedinUrl} alt="linkedin icon" />
          </a>
          <a href="https://twitter.com/testkun08080" target="_blank" rel="noreferrer" aria-label="x">
            <img src={iconTwitterUrl} alt="x icon" />
          </a>
        </div>
      </section>
    </PageFrame>
  );
}
