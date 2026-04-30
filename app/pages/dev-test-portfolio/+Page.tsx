import { animate, stagger } from "animejs";
import { useReducedMotion } from "motion/react";
import { useLayoutEffect, useMemo, useRef } from "react";

const pageModules = import.meta.glob("../*/+Page.tsx");

const devLinks = Object.keys(pageModules)
  .map((filePath) => filePath.replace("../", "").replace("/+Page.tsx", ""))
  .filter((route) => route.startsWith("dev") && route !== "dev")
  .sort()
  .map((route) => `/${route}`);

const SKILL_SECTIONS = [
  {
    title: "Core Qualifications",
    summary:
      "7+ years as a Technical Artist focused on shaders, pipelines, and look development.",
    tags: [
      "Shader authoring",
      "Pipeline design",
      "LookDev workflow",
      "Cross-team communication",
    ],
  },
  {
    title: "Software & Languages",
    summary: "Resumeベースの運用スキルをわかりやすく再編。",
    tags: [
      "Unity / Maya / MudBox",
      "Jenkins / Git",
      "Japanese (Native)",
      "English (Intermediate)",
    ],
  },
  {
    title: "R&D / Problem Solving",
    summary: "AI識別検証やテクスチャ生成など、実制作に直結する検証を推進。",
    tags: ["YOLO", "ComfyUI", "Texture workflow", "Optimization tooling"],
  },
] as const;

const VIDEO_ITEMS = [
  {
    title: "Shader & LookDev Breakdown",
    summary:
      "シェーダー構築とLookDev支援の流れを紹介するサンプル動画枠（仮）。",
    badge: "Shader",
  },
  {
    title: "Pipeline Tooling Showcase",
    summary:
      "Unity/Maya向けのツール開発と運用効率化をまとめるサンプル動画枠（仮）。",
    badge: "Pipeline",
  },
  {
    title: "Team Support & Optimization",
    summary:
      "大規模チームの技術支援と最適化プロセスを説明するサンプル動画枠（仮）。",
    badge: "Production",
  },
] as const;

const TOOL_ICON_BASE = "/skill-icons";

const TOOL_ICON_ITEMS = [
  { name: "Unity", file: "tool_unity.svg" },
  { name: "Maya", file: "tool_maya.svg" },
  { name: "Houdini", file: "tool_houdini.svg" },
  { name: "Blender", file: "tool_blender.svg" },
  { name: "Git", file: "tool_git.svg" },
  { name: "Docker", file: "tool_docker.svg" },
  { name: "React", file: "lang_react.svg" },
  { name: "OpenGL", file: "lang_opengl.svg" },
  { name: "HLSL", file: "lang_hlsl.svg" },
] as const;

const REEL_INFO = {
  title: "Technical Artist Reels",
  summary:
    "YouTubeでそのまま再生できるように、リールを2本埋め込みました。制作ハイライトを短時間で確認できます。",
} as const;

const REEL_KEYWORDS =
  "SHADER • LOOKDEV • PIPELINE • TEAM SUPPORT • OPTIMIZATION •";

const REEL_VIDEOS = [
  {
    title: "Reel 01",
    watchUrl: "https://youtu.be/pMOKLQ0rxhU",
    embedUrl: "https://www.youtube.com/embed/pMOKLQ0rxhU?rel=0",
  },
  {
    title: "Reel 02",
    watchUrl: "https://youtu.be/L2ci7xq4EEk",
    embedUrl: "https://www.youtube.com/embed/L2ci7xq4EEk?rel=0",
  },
] as const;

const EXPERIENCE_ITEMS = [
  {
    period: "Dec 2024 - Present",
    role: "Technical Artist (Freelance)",
    highlights: [
      "Game device prototype for personal project",
      "Hands-on implementation and validation",
    ],
  },
  {
    period: "Sep 2022 - Nov 2024",
    role: "Lead Technical Artist at SIE MY CO., Ltd.",
    highlights: [
      "Supported 5-200 team scale across multiple projects",
      "Built Unity scripts/macros/tools and CI support with Jenkins/Git",
      "Worked on MLB series and The Last of Us: Part II - Remastered support",
    ],
  },
  {
    period: "Sep 2019 - Mar 2022",
    role: "Lead Technical Artist at CAPCOM CO., Ltd.",
    highlights: [
      "Street Fighter 6 pipeline, shader and lookdev support",
      "Worked with artists/engineers on new visual expression",
    ],
  },
  {
    period: "Jun 2017 - Aug 2019",
    role: "Senior TA / Shader Artist at CAPCOM CO., Ltd.",
    highlights: [
      "Street Fighter 6 and Devil May Cry 5 production support",
      "Built shaders and asset conversion support for production",
    ],
  },
] as const;

const ART_ORBS = [
  { size: 220, top: "8%", left: "4%", color: "rgba(127,29,29,0.16)" },
  { size: 180, top: "22%", left: "78%", color: "rgba(30,41,59,0.14)" },
  { size: 260, top: "62%", left: "10%", color: "rgba(191,219,254,0.2)" },
  { size: 200, top: "74%", left: "72%", color: "rgba(245,158,11,0.14)" },
] as const;

export default function Page() {
  const reduceMotion = useReducedMotion() ?? false;
  const rootRef = useRef<HTMLDivElement>(null);
  const heroTitleRef = useRef<HTMLHeadingElement>(null);
  const sideLinks = useMemo(
    () =>
      devLinks.filter((href) => href !== "/dev-test-portfolio").slice(0, 24),
    [],
  );

  useLayoutEffect(() => {
    if (reduceMotion) return;
    const root = rootRef.current;
    const heroTitle = heroTitleRef.current;
    if (!root || !heroTitle) return;

    const cleanups: Array<() => void> = [];

    const heroAnim = animate(heroTitle, {
      opacity: [0, 1],
      translateY: [24, 0],
      ease: "out(3)",
      duration: 900,
    });
    cleanups.push(() => heroAnim.revert());

    const sections = Array.from(
      root.querySelectorAll<HTMLElement>("[data-animate-section]"),
    );
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const target = entry.target as HTMLElement;
          observer.unobserve(target);
          const sectionAnim = animate(target, {
            opacity: [0, 1],
            translateY: [34, 0],
            duration: 750,
            ease: "out(3)",
          });
          cleanups.push(() => sectionAnim.revert());
        });
      },
      { threshold: 0.2 },
    );
    sections.forEach((s) => {
      s.style.opacity = "0";
      s.style.transform = "translateY(34px)";
      observer.observe(s);
    });

    const tags = Array.from(
      root.querySelectorAll<HTMLElement>("[data-skill-tag]"),
    );
    const tagAnim = animate(tags, {
      opacity: [0, 1],
      translateY: [14, 0],
      duration: 650,
      delay: stagger(40),
      ease: "out(2)",
    });
    cleanups.push(() => tagAnim.revert());

    const cards = Array.from(
      root.querySelectorAll<HTMLElement>("[data-video-card]"),
    );
    const floating = animate(cards, {
      translateY: ["-4px", "4px"],
      duration: 2200,
      delay: stagger(140),
      loop: true,
      alternate: true,
      ease: "inOut(2)",
    });
    cleanups.push(() => floating.revert());

    const artOrbs = Array.from(
      root.querySelectorAll<HTMLElement>("[data-art-orb]"),
    );
    const orbAnim = animate(artOrbs, {
      translateY: ["-22px", "22px"],
      translateX: ["-12px", "12px"],
      scale: [0.96, 1.04],
      rotate: ["-3deg", "3deg"],
      duration: 4600,
      delay: stagger(260),
      loop: true,
      alternate: true,
      ease: "inOut(2)",
    });
    cleanups.push(() => orbAnim.revert());

    const marquees = Array.from(
      root.querySelectorAll<HTMLElement>("[data-marquee]"),
    );
    marquees.forEach((row, i) => {
      const direction = i % 2 === 0 ? ["0%", "-26%"] : ["-26%", "0%"];
      const loopAnim = animate(row, {
        translateX: direction,
        duration: 22000 + i * 1400,
        ease: "linear",
        loop: true,
      });
      cleanups.push(() => loopAnim.revert());
    });

    const panels = Array.from(
      root.querySelectorAll<HTMLElement>("[data-panel]"),
    );
    const panelPulse = animate(panels, {
      boxShadow: [
        "0 10px 24px -18px rgba(15,23,42,0.45)",
        "0 20px 40px -24px rgba(127,29,29,0.35)",
      ],
      duration: 2400,
      delay: stagger(120),
      loop: true,
      alternate: true,
      ease: "inOut(2)",
    });
    cleanups.push(() => panelPulse.revert());

    const toolIcons = Array.from(
      root.querySelectorAll<HTMLElement>("[data-tool-icon]"),
    );
    const iconAnim = animate(toolIcons, {
      opacity: [0, 1],
      scale: [0.92, 1],
      duration: 520,
      delay: stagger(35),
      ease: "out(3)",
    });
    cleanups.push(() => iconAnim.revert());

    const reelGlows = Array.from(
      root.querySelectorAll<HTMLElement>("[data-reel-glow]"),
    );
    const glowAnim = animate(reelGlows, {
      scale: [0.9, 1.08],
      opacity: [0.35, 0.75],
      rotate: ["-6deg", "6deg"],
      duration: 3600,
      delay: stagger(180),
      loop: true,
      alternate: true,
      ease: "inOut(2)",
    });
    cleanups.push(() => glowAnim.revert());

    const reelTitle = root.querySelector<HTMLElement>("[data-reel-title]");
    if (reelTitle) {
      const titleAnim = animate(reelTitle, {
        letterSpacing: ["0.02em", "0.11em"],
        duration: 2200,
        loop: true,
        alternate: true,
        ease: "inOut(2)",
      });
      cleanups.push(() => titleAnim.revert());
    }

    const reelCards = Array.from(
      root.querySelectorAll<HTMLElement>("[data-reel-card]"),
    );
    const reelCardAnim = animate(reelCards, {
      translateY: ["0px", "-10px"],
      rotate: ["0deg", "0.45deg"],
      scale: [1, 1.02],
      duration: 2100,
      delay: stagger(220),
      loop: true,
      alternate: true,
      ease: "inOut(3)",
    });
    cleanups.push(() => reelCardAnim.revert());

    return () => {
      observer.disconnect();
      cleanups.forEach((fn) => fn());
    };
  }, [reduceMotion]);

  return (
    <main className="min-h-dvh bg-[#f7efe4] text-[#0f172a]">
      <div
        ref={rootRef}
        className="relative mx-auto flex w-full max-w-6xl snap-y snap-mandatory flex-col overflow-hidden px-5 pb-24 pt-10 sm:px-8 md:px-10"
      >
        <div className="pointer-events-none absolute inset-0 -z-10">
          {ART_ORBS.map((orb, i) => (
            <span
              key={`${orb.top}-${orb.left}`}
              data-art-orb
              className="absolute rounded-full blur-3xl"
              style={{
                width: `${orb.size}px`,
                height: `${orb.size}px`,
                top: orb.top,
                left: orb.left,
                backgroundColor: orb.color,
              }}
            />
          ))}
        </div>

        <section className="relative overflow-hidden rounded-3xl border border-[#d7c8b1] bg-[#f8f1e6] px-6 py-14 sm:px-10 sm:py-20">
          <div
            className="absolute inset-0 opacity-25"
            style={{
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          <div className="absolute inset-0 bg-[#fbf6ee]/90" />
          <div className="relative z-10 mx-auto flex w-full max-w-3xl flex-col items-center gap-6 text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-[#991b1b]">
              portfolio / dev-test
            </p>
            <h1
              ref={heroTitleRef}
              className="text-3xl font-semibold tracking-tight sm:text-5xl"
            >
              Resume内容を
              <br />
              スクロールで直感的に紹介
            </h1>
            <p className="max-w-2xl text-sm leading-relaxed text-[#334155] sm:text-base">
              `resume_en.pdf`
              の情報を元に、スキル・職歴・動画紹介を視線誘導しやすい
              レイアウトに再編しています。ページ全体はスムーズに読み進められる設計です。
            </p>
          </div>
          <div className="relative z-10 mt-10 space-y-2 overflow-hidden">
            <p
              data-marquee
              className="whitespace-nowrap text-xs font-semibold uppercase tracking-[0.28em] text-[#7f1d1d]"
            >
              TECHNICAL ARTIST • SHADER • LOOKDEV • PIPELINE • TECHNICAL ARTIST
              • SHADER • LOOKDEV • PIPELINE •
            </p>
            <p
              data-marquee
              className="whitespace-nowrap text-xs font-semibold uppercase tracking-[0.28em] text-[#334155]"
            >
              UNITY • MAYA • HOUDINI • REACT • OPENGL • HLSL • UNITY • MAYA •
              HOUDINI • REACT • OPENGL • HLSL •
            </p>
          </div>
        </section>

        <section data-animate-section className="mt-16 snap-start">
          <div className="mb-6 flex items-end justify-between gap-4">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Resume Skills
            </h2>
            <span className="text-xs uppercase tracking-[0.22em] text-[#7c2d12]">
              placeholder data
            </span>
          </div>
          <div className="grid gap-5 md:grid-cols-12">
            {SKILL_SECTIONS.map((section, i) => (
              <article
                key={section.title}
                data-panel
                className={`rounded-2xl border border-[#d9ccb9] bg-[#fbf6ee]/95 p-5 shadow-[0_10px_24px_-18px_rgba(15,23,42,0.45)] backdrop-blur ${
                  i === 0
                    ? "md:col-span-7 md:-rotate-1"
                    : i === 1
                      ? "md:col-span-5 md:translate-y-8 md:rotate-1"
                      : "md:col-span-8 md:-translate-y-2 md:translate-x-16 md:-rotate-[0.8deg]"
                }`}
              >
                <h3 className="text-lg font-semibold text-[#7f1d1d]">
                  {section.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[#475569]">
                  {section.summary}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {section.tags.map((tag) => (
                    <span
                      key={tag}
                      data-skill-tag
                      className="rounded-full border border-[#c8b49c] bg-[#f7efe4] px-3 py-1 text-xs font-medium text-[#1e293b]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section data-animate-section className="mt-16 snap-start">
          <div className="mb-6 flex items-end justify-between gap-4">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Experience Timeline
            </h2>
            <span className="text-xs uppercase tracking-[0.22em] text-[#7c2d12]">
              from resume
            </span>
          </div>
          <div className="space-y-4">
            {EXPERIENCE_ITEMS.map((item) => (
              <article
                key={`${item.period}-${item.role}`}
                data-panel
                className="rounded-2xl border border-[#d9ccb9] bg-[#fbf6ee] p-5"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#7f1d1d]">
                  {item.period}
                </p>
                <h3 className="mt-2 text-lg font-semibold text-[#0f172a]">
                  {item.role}
                </h3>
                <ul className="mt-3 list-inside list-disc space-y-1 text-sm text-[#475569]">
                  {item.highlights.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section data-animate-section className="mt-16 snap-start">
          <div className="mb-6 flex items-end justify-between gap-4">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Tools & Languages
            </h2>
            <span className="text-xs uppercase tracking-[0.22em] text-[#7c2d12]">
              from src_old/assets
            </span>
          </div>
          <div className="relative overflow-hidden rounded-3xl border border-[#d9ccb9] bg-[#fbf6ee]/90 px-4 py-5">
            <div className="pointer-events-none absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-[#fbf6ee] to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-[#fbf6ee] to-transparent" />
            <div
              data-marquee
              className="flex w-max min-w-full items-center gap-3"
            >
              {[...TOOL_ICON_ITEMS, ...TOOL_ICON_ITEMS].map((item, i) => (
                <article
                  key={`${item.name}-${i}`}
                  data-tool-icon
                  data-panel
                  className="flex shrink-0 items-center gap-3 rounded-full border border-[#d9ccb9] bg-[#f7efe4] px-4 py-2.5"
                >
                  <img
                    src={`${TOOL_ICON_BASE}/${item.file}`}
                    alt={item.name}
                    className="h-7 w-7 shrink-0 object-contain"
                    loading="lazy"
                    draggable={false}
                  />
                  <span className="text-sm font-medium text-[#334155]">
                    {item.name}
                  </span>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section data-animate-section className="mt-16 snap-start">
          <div className="mb-6 flex items-end justify-between gap-4">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Portfolio Videos
            </h2>
            <span className="text-xs uppercase tracking-[0.22em] text-[#7c2d12]">
              mock cards
            </span>
          </div>
          <div className="grid gap-5 md:grid-cols-12">
            {VIDEO_ITEMS.map((item, i) => (
              <article
                key={item.title}
                data-video-card
                data-panel
                className={`overflow-hidden rounded-2xl border border-[#d9ccb9] bg-[#fbf6ee] shadow-[0_10px_24px_-18px_rgba(15,23,42,0.45)] ${
                  i === 0
                    ? "md:col-span-7 md:-rotate-[0.7deg]"
                    : i === 1
                      ? "md:col-span-5 md:translate-y-10 md:rotate-[0.8deg]"
                      : "md:col-span-8 md:-translate-y-2 md:translate-x-10 md:-rotate-[0.5deg]"
                }`}
              >
                <div className="relative aspect-video w-full overflow-hidden bg-[#1e293b]">
                  <div
                    className="absolute inset-0 opacity-35"
                    style={{
                      backgroundImage:
                        "linear-gradient(135deg, rgba(239,68,68,0.8), rgba(15,23,42,0.9))",
                    }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="rounded-full border border-white/40 bg-white/10 px-4 py-1.5 text-xs uppercase tracking-[0.2em] text-white">
                      Video Placeholder
                    </span>
                  </div>
                  <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#7f1d1d]">
                    {item.badge}
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="text-base font-semibold text-[#0f172a]">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#475569]">
                    {item.summary}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section data-animate-section className="mt-16 snap-start">
          <div className="rounded-2xl border border-[#d9ccb9] bg-[#fbf6ee] px-5 py-6 sm:px-7">
            <h2 className="text-lg font-semibold text-[#7f1d1d]">
              Dev Playground Links
            </h2>
            <p className="mt-2 text-sm text-[#475569]">
              既存の検証ページはサブ導線としてここにまとめています。
            </p>
            <div className="mt-4 flex flex-wrap gap-2.5">
              {sideLinks.map((href) => (
                <a
                  key={href}
                  href={href}
                  className="rounded-full border border-[#c8b49c] bg-[#f7efe4] px-3 py-1.5 text-xs text-[#334155] underline underline-offset-4 transition hover:text-[#0f172a]"
                >
                  {href}
                </a>
              ))}
            </div>
          </div>
        </section>

        <section data-animate-section className="mt-16 snap-start">
          <article className="relative overflow-hidden rounded-3xl border border-[#d7c8b1] bg-[#0f172a] px-6 py-8 text-[#f8fafc] sm:px-8 sm:py-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(239,68,68,0.32),transparent_55%),radial-gradient(circle_at_80%_10%,rgba(56,189,248,0.25),transparent_50%),linear-gradient(140deg,#0f172a,#111827_55%,#1f2937)]" />
            <span
              data-reel-glow
              className="pointer-events-none absolute -left-8 top-16 h-44 w-44 rounded-full bg-red-500/30 blur-3xl"
            />
            <span
              data-reel-glow
              className="pointer-events-none absolute -right-8 bottom-16 h-56 w-56 rounded-full bg-sky-400/25 blur-3xl"
            />
            <div className="relative z-10 flex flex-col gap-4">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-red-200/90">
                Grand Finale
              </p>
              <h2
                data-reel-title
                className="text-2xl font-semibold tracking-tight text-white sm:text-3xl"
              >
                {REEL_INFO.title}
              </h2>
              <p className="max-w-3xl text-sm leading-relaxed text-slate-200 sm:text-base">
                {REEL_INFO.summary}
              </p>
              <p className="whitespace-nowrap text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-300">
                {REEL_KEYWORDS.repeat(2)}
              </p>
              <div className="grid gap-4 md:grid-cols-2">
                {REEL_VIDEOS.map((video) => (
                  <div
                    key={video.embedUrl}
                    data-reel-card
                    className="overflow-hidden rounded-2xl border border-white/25 bg-black/35 backdrop-blur"
                  >
                    <div className="aspect-video w-full">
                      <iframe
                        className="h-full w-full"
                        src={video.embedUrl}
                        title={video.title}
                        loading="lazy"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                      />
                    </div>
                    <div className="px-4 py-3">
                      <a
                        href={video.watchUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm font-medium text-slate-100 underline underline-offset-4 hover:text-white"
                      >
                        {video.title} をYouTubeで開く
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </article>
        </section>
      </div>
    </main>
  );
}
