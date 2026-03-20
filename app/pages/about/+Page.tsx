import { PageFrame } from "../../components/PageFrame";
import { useLanguage } from "../../lib/LanguageContext";

function AboutCard({ title, body }: { title: string; body: string }) {
  return (
    <section className="rounded-2xl border border-black/15 bg-white/55 p-6 shadow-lg">
      <h3 className="m-0 text-xl font-bold tracking-wide">{title}</h3>
      <p className="mt-3 whitespace-pre-line leading-7 text-slate-700">{body}</p>
    </section>
  );
}

export default function Page() {
  const { t } = useLanguage();
  const hobbies = t("about_hobbies_list");

  return (
    <PageFrame titleKey="about_title">
      <div className="grid gap-6">
        <section className="rounded-2xl border border-black/15 bg-white/55 p-6 shadow-lg">
          <p className="m-0 leading-8 text-slate-800">{t("about_greeting")}</p>
          <a
            href="/resume_en.pdf"
            className="mt-6 inline-flex rounded-full border border-black/20 bg-white px-6 py-2 font-semibold text-slate-800"
          >
            {t("about_resume")}
          </a>
        </section>

        <AboutCard
          title={String(t("about_qualifications_title"))}
          body={String(t("about_qualifications_desc"))}
        />
        <AboutCard title={String(t("about_tools_title"))} body={String(t("about_tools_list"))} />
        <AboutCard
          title={String(t("about_programming_title"))}
          body={String(t("about_programming_list"))}
        />

        <section className="rounded-2xl border border-black/15 bg-white/55 p-6 shadow-lg">
          <h3 className="m-0 text-xl font-bold tracking-wide">{t("about_hobbies_title")}</h3>
          <ul className="mt-4 grid list-disc grid-cols-1 gap-2 pl-5 md:grid-cols-2">
            {Array.isArray(hobbies) &&
              hobbies.map((item) => (
                <li key={item} className="text-slate-700">
                  {item}
                </li>
              ))}
          </ul>
        </section>
      </div>
    </PageFrame>
  );
}
