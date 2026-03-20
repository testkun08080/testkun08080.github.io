import { PageFrame } from "../../components/PageFrame";
import { useLanguage } from "../../lib/LanguageContext";
import styles from "./Reels.module.css";

type Reel = {
  id: number;
  period: string;
  title: string;
  description: string;
  youtubeId: string;
};

function ReelCard({ reel }: { reel: Reel }) {
  return (
    <article className={styles.card}>
      <div className={styles.player}>
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
      <div className={styles.body}>
        <div className={styles.period}>{reel.period}</div>
        <h2 className={styles.title}>{reel.title}</h2>
        <p className={styles.description}>{reel.description}</p>
      </div>
    </article>
  );
}

export default function Page() {
  const { t } = useLanguage();
  const reels: Reel[] = [
    {
      id: 1,
      period: "2022-2024",
      title: String(t("reels_2022_2024")),
      description: String(t("reels_2022_2024_desc")),
      youtubeId: "pMOKLQ0rxhU",
    },
    {
      id: 2,
      period: "2017-2022",
      title: String(t("reels_2017_2022")),
      description: String(t("reels_2017_2022_desc")),
      youtubeId: "L2ci7xq4EEk",
    },
  ];

  return (
    <PageFrame titleKey="reels_title">
      <div className={styles.grid}>
        {reels.map((reel) => (
          <ReelCard key={reel.id} reel={reel} />
        ))}
      </div>
    </PageFrame>
  );
}
