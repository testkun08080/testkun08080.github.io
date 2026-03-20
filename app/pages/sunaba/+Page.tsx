import { PageFrame } from "../../components/PageFrame";
import { useLanguage } from "../../lib/LanguageContext";

export default function Page() {
  const { t } = useLanguage();

  return (
    <PageFrame titleKey="nav_sunaba">
      <section className="rounded-3xl border border-black/15 bg-white/45 p-10 text-center shadow-xl">
        <h2 className="m-0 text-[clamp(3rem,10vw,7rem)] leading-none tracking-[0.25em] text-slate-900">
          {t("sunaba_jp")}
        </h2>
        <p className="mt-4 text-xl tracking-[0.35em] text-slate-700">{t("sunaba_en")}</p>
        <p className="mx-auto mt-8 max-w-[36ch] text-slate-700">{t("sunaba_message")}</p>
        <nav className="mt-10 flex flex-wrap justify-center gap-3">
          <a href="/about" className="rounded-full border border-black/20 px-5 py-2 font-semibold text-slate-800">
            {t("nav_about")}
          </a>
          <a href="/reels" className="rounded-full border border-black/20 px-5 py-2 font-semibold text-slate-800">
            {t("nav_reels")}
          </a>
          <a
            href="/contact"
            className="rounded-full border border-black/20 px-5 py-2 font-semibold text-slate-800"
          >
            {t("nav_contact")}
          </a>
        </nav>
      </section>
    </PageFrame>
  );
}
