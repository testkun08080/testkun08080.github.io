import { PageFrame } from "../../components/PageFrame";
import { useLanguage } from "../../lib/LanguageContext";

type Reel = {
  id: number;
  title: string;
  description: string;
  youtubeId: string;
};

function ReelCard({ reel }: { reel: Reel }) {
  return (
    <article className="overflow-hidden rounded-2xl border border-black/15 bg-white/80 shadow-xl">
      <div className="aspect-video w-full bg-black">
        <iframe
          width="100%"
          height="100%"
          src={`https://www.youtube.com/embed/${reel.youtubeId}`}
          title={reel.title}
          frameBorder={0}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
      <div className="p-5">
        <h2 className="m-0 text-xl font-bold text-slate-900">{reel.title}</h2>
        <p className="mt-2 text-slate-700">{reel.description}</p>
      </div>
    </article>
  );
}

export default function Page() {
  const { t } = useLanguage();
  const reels: Reel[] = [
    {
      id: 1,
      title: String(t("reels_2022_2024")),
      description: String(t("reels_2022_2024_desc")),
      youtubeId: "pMOKLQ0rxhU",
    },
    {
      id: 2,
      title: String(t("reels_2017_2022")),
      description: String(t("reels_2017_2022_desc")),
      youtubeId: "L2ci7xq4EEk",
    },
  ];

  return (
    <PageFrame titleKey="reels_title">
      <div className="grid gap-6">
        {reels.map((reel) => (
          <ReelCard key={reel.id} reel={reel} />
        ))}
      </div>
    </PageFrame>
  );
}
