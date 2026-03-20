import { PageFrame } from "../../components/PageFrame";
import { useLanguage } from "../../lib/LanguageContext";

export default function Page() {
  const { t } = useLanguage();

  return (
    <PageFrame titleKey="contact_title">
      <section className="mx-auto flex max-w-xl flex-col items-center gap-6 rounded-2xl border-2 border-black/25 bg-white/60 p-10 text-center shadow-xl">
        <p className="m-0 text-lg text-slate-800">{t("contact_message")}</p>
        <a
          href={`mailto:${String(t("contact_info"))}`}
          className="rounded-full border border-black/20 bg-white px-6 py-2 text-lg font-semibold text-slate-900"
        >
          {t("contact_info")}
        </a>
        <div className="flex flex-wrap justify-center gap-3">
          <a href="https://github.com/testkun08080" target="_blank" rel="noreferrer" className="underline">
            GitHub
          </a>
          <a
            href="https://linkedin.com/in/testkun08080"
            target="_blank"
            rel="noreferrer"
            className="underline"
          >
            LinkedIn
          </a>
          <a href="https://twitter.com/testkun08080" target="_blank" rel="noreferrer" className="underline">
            X
          </a>
        </div>
      </section>
    </PageFrame>
  );
}
