import { animate } from "animejs";
import { useReducedMotion } from "motion/react";
import { useId, useLayoutEffect, useRef, type RefObject } from "react";

const RECT_PATH_D = "M 80 80 L 320 80 L 320 320 L 80 320 Z";
/** 左→右の棒線（マーキー用） */
const LINE_PATH_D = "M 24 48 L 376 48";

/** 二重テキスト + 0%→50% でシームレス（従来 0→100%/14s に近い速さ ≈ 0→50%/7s） */
const PATH_ANIM = {
  durationMs: 7000,
  ease: "linear" as const,
  offsetPct: { from: 0, to: 50 },
} as const;

const RECT_TEXT_UNIT =
  "Lorem ipsum — anime.js でパスに沿って動きます。0123456789 ABCDEF — ";
const RECT_PATH_TEXT_LOOP = `${RECT_TEXT_UNIT.repeat(3)}${RECT_TEXT_UNIT.repeat(3)}`;

const LINE_TEXT_UNIT = "横スクロール風 — 0123456789 ABCDEF — ";
const LINE_PATH_TEXT_LOOP = `${LINE_TEXT_UNIT.repeat(6)}${LINE_TEXT_UNIT.repeat(6)}`;

function useStartOffsetLoop(textPathRef: RefObject<SVGTextPathElement | null>) {
  const reduceMotion = useReducedMotion() ?? false;

  useLayoutEffect(() => {
    const tp = textPathRef.current;
    if (!tp || reduceMotion) return;

    const state = { offsetPct: PATH_ANIM.offsetPct.from };
    let anim: ReturnType<typeof animate> | null = null;

    const run = () => {
      anim?.revert();
      anim = null;
      state.offsetPct = PATH_ANIM.offsetPct.from;
      tp.setAttribute("startOffset", `${PATH_ANIM.offsetPct.from}%`);

      anim = animate(state, {
        offsetPct: [PATH_ANIM.offsetPct.from, PATH_ANIM.offsetPct.to],
        duration: PATH_ANIM.durationMs,
        ease: PATH_ANIM.ease,
        loop: true,
        onUpdate: () => {
          tp.setAttribute("startOffset", `${state.offsetPct}%`);
        },
      });
    };

    void document.fonts.ready.then(() => requestAnimationFrame(run));

    return () => {
      anim?.revert();
      anim = null;
      tp.setAttribute("startOffset", `${PATH_ANIM.offsetPct.from}%`);
    };
  }, [reduceMotion]);
}

function RectPathSample() {
  const rawId = useId();
  const pathId = `dev-rect-${rawId.replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const textPathRef = useRef<SVGTextPathElement>(null);
  useStartOffsetLoop(textPathRef);

  return (
    <svg
      viewBox="0 0 400 400"
      className="aspect-square w-full max-w-lg"
      role="img"
      aria-label="Rectangle path with textPath"
    >
      <defs>
        <path id={pathId} d={RECT_PATH_D} />
      </defs>
      <use
        href={`#${pathId}`}
        fill="none"
        stroke="#64748b"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <text
        fill="#0f172a"
        fontSize="13"
        fontFamily="ui-sans-serif, system-ui, sans-serif"
        letterSpacing="0.06em"
      >
        <textPath ref={textPathRef} href={`#${pathId}`} startOffset="0%">
          {RECT_PATH_TEXT_LOOP}
        </textPath>
      </text>
    </svg>
  );
}

function HorizontalLineMarquee() {
  const rawId = useId();
  const pathId = `dev-line-${rawId.replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const textPathRef = useRef<SVGTextPathElement>(null);
  useStartOffsetLoop(textPathRef);

  return (
    <svg
      viewBox="0 0 400 96"
      className="h-28 w-full max-w-lg overflow-visible"
      role="img"
      aria-label="Horizontal line with looping textPath"
    >
      <defs>
        <path id={pathId} d={LINE_PATH_D} />
      </defs>
      <use
        href={`#${pathId}`}
        fill="none"
        stroke="#64748b"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <text
        fill="#0f172a"
        fontSize="14"
        fontFamily="ui-sans-serif, system-ui, sans-serif"
        letterSpacing="0.04em"
      >
        <textPath ref={textPathRef} href={`#${pathId}`} startOffset="0%">
          {LINE_PATH_TEXT_LOOP}
        </textPath>
      </text>
    </svg>
  );
}

export default function Page() {
  return (
    <main className="flex min-h-dvh flex-col items-center gap-10 bg-slate-50 px-4 py-10 text-slate-900">
      <h1 className="text-lg font-bold tracking-tight">開発（anime.js）</h1>

      <section className="flex w-full max-w-lg flex-col items-center gap-3">
        <h2 className="text-sm font-semibold text-slate-500">四角パス</h2>
        <p className="text-center text-xs text-slate-500">
          同一文を二連結し、startOffset を 0%→50% のみ線形ループ
        </p>
        <RectPathSample />
      </section>

      <section className="flex w-full max-w-lg flex-col items-center gap-3">
        <h2 className="text-sm font-semibold text-slate-500">棒線パス（横）</h2>
        <p className="text-center text-xs text-slate-500">
          同じく二重テキスト + 0%→50%。長めに繰り返してマーキー風
        </p>
        <HorizontalLineMarquee />
      </section>

      <nav className="flex flex-wrap justify-center gap-4 text-sm">
        <a
          href="/dev-css-loop"
          className="text-slate-500 underline underline-offset-4 hover:text-slate-800"
        >
          CSS マーキー（dev-css-loop）
        </a>
        <a
          href="/dev-anime-loop"
          className="text-slate-500 underline underline-offset-4 hover:text-slate-800"
        >
          anime.js マーキー（translateX）
        </a>
        <a
          href="/dev"
          className="text-slate-500 underline underline-offset-4 hover:text-slate-800"
        >
          静的版へ
        </a>
      </nav>
    </main>
  );
}
