import { motion, useReducedMotion } from "motion/react";

export type TopicItem = {
  id: string;
  eyebrow: string;
  title: string;
  body: string;
};

const DEFAULT_TOPICS: TopicItem[] = [
  {
    id: "intro",
    eyebrow: "01",
    title: "Intro",
    body: "スクロールに合わせてトピックが立ち上がります。ここにキャッチコピーや一言を置けます。",
  },
  {
    id: "work",
    eyebrow: "02",
    title: "Work",
    body: "制作物・案件・リールなど。後からカードやメディアを差し込む前提のプレースホルダです。",
  },
  {
    id: "skills",
    eyebrow: "03",
    title: "Skills",
    body: "ツール・言語・得意領域。ボケからフォーカスする動きで視線を誘導します。",
  },
  {
    id: "contact",
    eyebrow: "04",
    title: "Contact",
    body: "連絡先・SNS・フォームへの導線をここに。デザインはこの後で詰められます。",
  },
];

function TopicBlock({ topic, index }: { topic: TopicItem; index: number }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.section
      id={topic.id}
      aria-labelledby={`topic-${topic.id}-title`}
      className="scroll-mt-4 flex min-h-[100dvh] flex-col justify-center px-6 py-[clamp(3rem,12vh,6rem)] sm:px-10"
      initial={
        reduceMotion
          ? { opacity: 1, filter: "blur(0px)", y: 0, scale: 1 }
          : { opacity: 0.25, filter: "blur(18px)", y: 28, scale: 0.97 }
      }
      whileInView={
        reduceMotion
          ? { opacity: 1, filter: "blur(0px)", y: 0, scale: 1 }
          : { opacity: 1, filter: "blur(0px)", y: 0, scale: 1 }
      }
      viewport={{ once: false, margin: "-14% 0px -14% 0px", amount: 0.42 }}
      transition={{
        duration: 0.75,
        ease: [0.22, 1, 0.36, 1],
        delay: index * 0.02,
      }}
    >
      <div className="mx-auto w-full max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">{topic.eyebrow}</p>
        <h2 id={`topic-${topic.id}-title`} className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          {topic.title}
        </h2>
        <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-400 sm:text-lg">{topic.body}</p>
      </div>
    </motion.section>
  );
}

type TopicScrollProps = {
  topics?: TopicItem[];
};

export function TopicScroll({ topics = DEFAULT_TOPICS }: TopicScrollProps) {
  return (
    <div className="relative">
      <motion.header
        className="flex min-h-[100dvh] flex-col justify-end px-6 pb-[clamp(4rem,14vh,8rem)] pt-24 sm:px-10"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="mx-auto w-full max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">Portfolio base</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white sm:text-5xl">Scroll & focus</h1>
          <p className="mt-5 max-w-xl text-slate-400">
            下にスクロールするとトピックが順にフォーカスします。ノイズは画面全体に載っています。
          </p>
        </div>
      </motion.header>

      {topics.map((topic, i) => (
        <TopicBlock key={topic.id} topic={topic} index={i} />
      ))}

      <footer className="min-h-[40dvh] px-6 py-16 text-center text-sm text-slate-600 sm:px-10">end of section</footer>
    </div>
  );
}
