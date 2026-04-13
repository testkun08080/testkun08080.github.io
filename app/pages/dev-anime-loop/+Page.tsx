import { animate } from "animejs";
import { useReducedMotion } from "motion/react";
import { useId, useLayoutEffect, useRef, type RefObject } from "react";
import styles from "./DevAnimeLoop.module.css";

const LOOP_COPY =
  "Web Design Pallet Web Design Pallet Web Design Pallet Web Design Pallet";

const TEXT = {
  durationMs: 50_000,
  seekOddMs: 25_000,
  odd: ["100%", "-100%"] as const,
  even: ["0%", "-200%"] as const,
} as const;

const IMG = {
  durationMs: 80_000,
  seekOddMs: 40_000,
  odd: ["100%", "-100%"] as const,
  even: ["0%", "-200%"] as const,
} as const;

/**
 * 二重テキスト + startOffset を 0%→50% のみ動かすとループ境界で見た目がつながる
 */
const PATH_TEXT_ANIM = {
  durationMs: 8000,
  ease: "linear" as const,
  offsetPct: { from: 0, to: 100 },
} as const;

const RECT_PATH_D = "M 80 80 L 320 80 L 320 320 L 80 320 Z";
const WAVE_PATH_D = "M 28 96 Q 200 12 372 96";

const RECT_PATH_TEXT_UNIT = "*0123456789ABCDEF*ANIMEJS*DEV-LOOP*";
const RECT_PATH_TEXT_LOOP = `${RECT_PATH_TEXT_UNIT.repeat(14)}${RECT_PATH_TEXT_UNIT.repeat(14)}`;

const WAVE_PATH_TEXT_UNIT = "*WAVE*0123456789*PATH*TEXT*";
const WAVE_PATH_TEXT_LOOP = `${WAVE_PATH_TEXT_UNIT.repeat(10)}${WAVE_PATH_TEXT_UNIT.repeat(10)}`;

function useStartOffsetLoop(textPathRef: RefObject<SVGTextPathElement | null>) {
  const reduceMotion = useReducedMotion() ?? false;

  useLayoutEffect(() => {
    const tp = textPathRef.current;
    if (!tp || reduceMotion) return;

    const state = { offsetPct: PATH_TEXT_ANIM.offsetPct.from };
    let anim: ReturnType<typeof animate> | null = null;

    const run = () => {
      anim?.revert();
      anim = null;
      state.offsetPct = PATH_TEXT_ANIM.offsetPct.from;
      tp.setAttribute("startOffset", `${PATH_TEXT_ANIM.offsetPct.from}%`);

      anim = animate(state, {
        offsetPct: [PATH_TEXT_ANIM.offsetPct.from, PATH_TEXT_ANIM.offsetPct.to],
        duration: PATH_TEXT_ANIM.durationMs,
        ease: PATH_TEXT_ANIM.ease,
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
      tp.setAttribute("startOffset", `${PATH_TEXT_ANIM.offsetPct.from}%`);
    };
  }, [reduceMotion]);
}

function PathTextOnRect() {
  const rawId = useId();
  const pathId = `anime-loop-rect-${rawId.replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const textPathRef = useRef<SVGTextPathElement>(null);
  useStartOffsetLoop(textPathRef);

  return (
    <svg
      viewBox="0 0 400 400"
      className="aspect-square w-full max-w-md"
      role="img"
      aria-label="Rectangle path with looping barcode textPath"
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
      <text className={styles.pathBarcodeText}>
        <textPath ref={textPathRef} href={`#${pathId}`} startOffset="0%">
          {RECT_PATH_TEXT_LOOP}
        </textPath>
      </text>
    </svg>
  );
}

function PathTextOnWave() {
  const rawId = useId();
  const pathId = `anime-loop-wave-${rawId.replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const textPathRef = useRef<SVGTextPathElement>(null);
  useStartOffsetLoop(textPathRef);

  return (
    <svg
      viewBox="0 0 400 120"
      className="h-32 w-full max-w-2xl"
      role="img"
      aria-label="Wave path with looping barcode textPath"
    >
      <defs>
        <path id={pathId} d={WAVE_PATH_D} />
      </defs>
      <use
        href={`#${pathId}`}
        fill="none"
        stroke="#94a3b8"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <text className={styles.pathBarcodeTextWave}>
        <textPath ref={textPathRef} href={`#${pathId}`} startOffset="0%">
          {WAVE_PATH_TEXT_LOOP}
        </textPath>
      </text>
    </svg>
  );
}

function useTranslateXLoop<T extends HTMLElement>(
  ref: RefObject<T | null>,
  translateX: readonly [string, string],
  durationMs: number,
  play: boolean,
  seekToMs?: number,
) {
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || !play) return;

    const anim = animate(el, {
      translateX: [translateX[0], translateX[1]],
      duration: durationMs,
      ease: "linear",
      loop: true,
    });

    if (seekToMs !== undefined && seekToMs > 0) {
      anim.seek(seekToMs);
    }

    return () => {
      anim.revert();
    };
  }, [ref, translateX, durationMs, play, seekToMs]);
}

export default function Page() {
  const reduceMotion = useReducedMotion() ?? false;
  const play = !reduceMotion;

  const textOddRef = useRef<HTMLParagraphElement>(null);
  const textEvenRef = useRef<HTMLParagraphElement>(null);
  const imgOddRef = useRef<HTMLImageElement>(null);
  const imgEvenRef = useRef<HTMLImageElement>(null);

  useTranslateXLoop(
    textOddRef,
    TEXT.odd,
    TEXT.durationMs,
    play,
    TEXT.seekOddMs,
  );
  useTranslateXLoop(textEvenRef, TEXT.even, TEXT.durationMs, play);
  useTranslateXLoop(imgOddRef, IMG.odd, IMG.durationMs, play, IMG.seekOddMs);
  useTranslateXLoop(imgEvenRef, IMG.even, IMG.durationMs, play);

  return (
    <main className="flex min-h-dvh flex-col items-center gap-10 bg-slate-50 px-4 py-10 text-slate-900">
      <div className="flex max-w-3xl flex-col gap-2 text-center">
        <h1 className="text-lg font-bold tracking-tight">
          無限ループ（anime.js）
        </h1>
        <p className="text-sm text-slate-600">
          横マーキーは{" "}
          <code className="rounded bg-slate-200 px-1 py-0.5 text-xs">
            dev-css-loop
          </code>{" "}
          と同じ{" "}
          <code className="rounded bg-slate-200 px-1 py-0.5 text-xs">
            translateX
          </code>{" "}
          を anime.js で駆動。SVG{" "}
          <code className="rounded bg-slate-200 px-1 py-0.5 text-xs">
            {"<textPath>"}
          </code>{" "}
          は Libre Barcode 39 でパス上を移動。
        </p>
        <p className="text-xs text-slate-500">
          <a
            href="https://web-design-pallet.site/css-loop/"
            className="underline underline-offset-2 hover:text-slate-800"
            target="_blank"
            rel="noreferrer"
          >
            Web Design Pallet
          </a>
          {" · "}
          <a
            href="https://fonts.google.com/specimen/Libre+Barcode+39"
            className="underline underline-offset-2 hover:text-slate-800"
            target="_blank"
            rel="noreferrer"
          >
            Libre Barcode 39
          </a>
        </p>
      </div>

      <section className="w-full max-w-4xl space-y-3">
        <h2 className="text-sm font-semibold text-slate-700">テキスト</h2>
        <div className={styles.textTrack}>
          <p ref={textOddRef} className={styles.loopText}>
            {LOOP_COPY}
          </p>
          <p ref={textEvenRef} className={styles.loopText}>
            {LOOP_COPY}
          </p>
        </div>
        <p className="text-xs text-slate-500">
          <code className="rounded bg-slate-200 px-1">translateX</code>{" "}
          マーキー（奇数{" "}
          <code className="rounded bg-slate-200 px-1">seek(25s)</code>）
        </p>
      </section>

      <section className="w-full max-w-4xl space-y-4">
        <h2 className="text-sm font-semibold text-slate-700">
          パス上のバーコード（SVG textPath）
        </h2>
        <p className="text-xs text-slate-500">
          二重テキスト +{" "}
          <code className="rounded bg-slate-200 px-1">startOffset</code> 0%→50%
          でシームレスループ。
        </p>
        <div className="flex flex-col items-center gap-10">
          <div className="flex w-full flex-col items-center gap-2">
            <span className="text-xs font-medium text-slate-500">矩形パス</span>
            <PathTextOnRect />
          </div>
          <div className="flex w-full flex-col items-center gap-2">
            <span className="text-xs font-medium text-slate-500">波線パス</span>
            <PathTextOnWave />
          </div>
        </div>
      </section>

      <section className="w-full max-w-4xl space-y-3">
        <h2 className="text-sm font-semibold text-slate-700">画像</h2>
        <div className={styles.imageTrack}>
          <img
            ref={imgOddRef}
            className={styles.loopImage}
            src="/vite.svg"
            alt=""
            width={400}
            height={200}
            draggable={false}
          />
          <img
            ref={imgEvenRef}
            className={styles.loopImage}
            src="/vite.svg"
            alt=""
            width={400}
            height={200}
            draggable={false}
          />
        </div>
      </section>

      <nav className="flex flex-wrap justify-center gap-4 text-sm">
        <a
          href="/dev-css-loop"
          className="text-slate-500 underline underline-offset-4 hover:text-slate-800"
        >
          dev-css-loop
        </a>
        <a
          href="/dev"
          className="text-slate-500 underline underline-offset-4 hover:text-slate-800"
        >
          /dev
        </a>
        <a
          href="/dev-anime"
          className="text-slate-500 underline underline-offset-4 hover:text-slate-800"
        >
          dev-anime
        </a>
      </nav>
    </main>
  );
}
