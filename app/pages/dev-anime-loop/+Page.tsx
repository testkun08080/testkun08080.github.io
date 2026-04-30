import { animate, createTimeline, stagger } from "animejs";
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

const PATH = {
  durationMs: 8000,
  seekOddMs: 4000,
  odd: [-100, 0] as const,
  even: [100, 200] as const,
} as const;

const RECT_PATH_D = "M 80 80 L 320 80 L 320 320 L 80 320 Z";
const WAVE_PATH_D = "M 28 96 Q 200 12 372 96";

const RECT_PATH_TEXT_UNIT = "*0123456789ABCDEF*ANIMEJS*DEV-LOOP*";
const RECT_PATH_TEXT_LOOP = `${RECT_PATH_TEXT_UNIT.repeat(14)}${RECT_PATH_TEXT_UNIT.repeat(14)}`;

const WAVE_PATH_TEXT_UNIT = "*WAVE*0123456789*PATH*TEXT*";
const WAVE_PATH_TEXT_LOOP = `${WAVE_PATH_TEXT_UNIT.repeat(10)}${WAVE_PATH_TEXT_UNIT.repeat(10)}`;
const TEMPLATE_COPY = "Custom HTML template.";
const TEMPLATE_BARCODE_UNIT = "*0123456789*HTML*TEMPLATE*";
const TEMPLATE_BARCODE_LOOP = `${TEMPLATE_BARCODE_UNIT.repeat(20)}${TEMPLATE_BARCODE_UNIT.repeat(20)}`;
const BARCODE_3D_UNIT = "*0123456789ABCDEF*";
const BARCODE_3D_TEXT = BARCODE_3D_UNIT.repeat(6);

function useStartOffsetLoop<T extends SVGTextPathElement>(
  ref: RefObject<T | null>,
  offsetPct: readonly [number, number],
  durationMs: number,
  play: boolean,
  seekToMs?: number,
) {
  useLayoutEffect(() => {
    const tp = ref.current;
    if (!tp || !play) return;

    const state = { offsetPct: offsetPct[0] };
    let anim: ReturnType<typeof animate> | null = null;
    tp.setAttribute("startOffset", `${offsetPct[0]}%`);

    anim = animate(state, {
      offsetPct: [offsetPct[0], offsetPct[1]],
      duration: durationMs,
      ease: "linear",
      loop: true,
      onUpdate: () => {
        tp.setAttribute("startOffset", `${state.offsetPct}%`);
      },
    });

    if (seekToMs !== undefined && seekToMs > 0) {
      anim.seek(seekToMs);
    }

    return () => {
      anim?.revert();
      anim = null;
      tp.setAttribute("startOffset", `${offsetPct[0]}%`);
    };
  }, [ref, offsetPct, durationMs, play, seekToMs]);
}

function PathTextOnRect({ play }: { play: boolean }) {
  const rawId = useId();
  const pathId = `anime-loop-rect-${rawId.replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const oddTextPathRef = useRef<SVGTextPathElement>(null);
  const evenTextPathRef = useRef<SVGTextPathElement>(null);
  useStartOffsetLoop(
    oddTextPathRef,
    PATH.odd,
    PATH.durationMs,
    play,
    PATH.seekOddMs,
  );
  useStartOffsetLoop(evenTextPathRef, PATH.even, PATH.durationMs, play);

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
      <text className={styles.pathBarcodeText}>
        <textPath ref={oddTextPathRef} href={`#${pathId}`} startOffset="100%">
          {RECT_PATH_TEXT_LOOP}
        </textPath>
      </text>
      <text className={styles.pathBarcodeText}>
        <textPath ref={evenTextPathRef} href={`#${pathId}`} startOffset="0%">
          {RECT_PATH_TEXT_LOOP}
        </textPath>
      </text>
    </svg>
  );
}

function PathTextOnWave({ play }: { play: boolean }) {
  const rawId = useId();
  const pathId = `anime-loop-wave-${rawId.replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const oddTextPathRef = useRef<SVGTextPathElement>(null);
  const evenTextPathRef = useRef<SVGTextPathElement>(null);
  useStartOffsetLoop(
    oddTextPathRef,
    PATH.odd,
    PATH.durationMs,
    play,
    PATH.seekOddMs,
  );
  useStartOffsetLoop(evenTextPathRef, PATH.even, PATH.durationMs, play);

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
        <textPath ref={oddTextPathRef} href={`#${pathId}`} startOffset="100%">
          {WAVE_PATH_TEXT_LOOP}
        </textPath>
      </text>
      <text className={styles.pathBarcodeTextWave}>
        <textPath ref={evenTextPathRef} href={`#${pathId}`} startOffset="0%">
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

function SplitTemplateWithPathBarcode({ play }: { play: boolean }) {
  const rawId = useId();
  const pathId = `anime-loop-template-${rawId.replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const oddTextPathRef = useRef<SVGTextPathElement>(null);
  const evenTextPathRef = useRef<SVGTextPathElement>(null);
  const tokenRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const tokens = TEMPLATE_COPY.split(" ");

  useStartOffsetLoop(
    oddTextPathRef,
    PATH.odd,
    PATH.durationMs * 1.5,
    play,
    PATH.seekOddMs,
  );
  useStartOffsetLoop(evenTextPathRef, PATH.even, PATH.durationMs * 1.5, play);

  useLayoutEffect(() => {
    if (!play) return;
    const els = tokenRefs.current.filter(
      (el): el is HTMLSpanElement => el !== null,
    );
    if (els.length === 0) return;

    const anim = animate(els, {
      translateY: ["0%", "-100%"],
      duration: 820,
      delay: (_, i) => i * 130,
      ease: "inOut(2)",
      loop: true,
      loopDelay: 280,
    });

    return () => {
      anim.revert();
    };
  }, [play]);

  return (
    <div className={styles.templateComposite}>
      <svg
        viewBox="0 0 400 140"
        className={styles.templateCompositeSvg}
        role="img"
        aria-label="Custom HTML template with barcode textPath"
      >
        <defs>
          <path id={pathId} d="M 18 70 L 382 70" />
        </defs>
        <text className={styles.templateBarcodeText}>
          <textPath ref={oddTextPathRef} href={`#${pathId}`} startOffset="100%">
            {TEMPLATE_BARCODE_LOOP}
          </textPath>
        </text>
        <text className={styles.templateBarcodeText}>
          <textPath ref={evenTextPathRef} href={`#${pathId}`} startOffset="0%">
            {TEMPLATE_BARCODE_LOOP}
          </textPath>
        </text>
      </svg>
      <p className={styles.splitTarget} aria-label={TEMPLATE_COPY}>
        {tokens.map((token, i) => (
          <span
            key={`${token}-${i}`}
            ref={(el) => {
              tokenRefs.current[i] = el;
            }}
            className={styles.splitToken}
          >
            <span className={styles.splitTokenTop}>{token}</span>
            <span className={styles.splitTokenBottom}>{token}</span>
          </span>
        ))}
      </p>
    </div>
  );
}

function PathBarcodeTemplate3D({ play }: { play: boolean }) {
  const rawId = useId();
  const pathId = `anime-loop-3d-barcode-${rawId.replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const itemsLayerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const charRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const topRefs = useRef<Array<HTMLElement | null>>([]);
  const frontRefs = useRef<Array<HTMLElement | null>>([]);
  const bottomRefs = useRef<Array<HTMLElement | null>>([]);
  const chars = Array.from(BARCODE_3D_TEXT);

  useLayoutEffect(() => {
    if (!play) return;
    const svg = svgRef.current;
    const path = pathRef.current;
    const itemsLayer = itemsLayerRef.current;
    if (!svg || !path || !itemsLayer) return;

    const items = itemRefs.current.filter(
      (el): el is HTMLSpanElement => el !== null,
    );
    if (items.length === 0) return;

    const pathLen = path.getTotalLength();
    const spacing = pathLen / items.length;
    const state = { offset: 0 };
    const viewBox = svg.viewBox.baseVal;
    const viewBoxWidth = viewBox.width || 1;
    const viewBoxHeight = viewBox.height || 1;

    const flowAnim = animate(state, {
      offset: [0, -pathLen],
      duration: 9000,
      ease: "linear",
      loop: true,
      onUpdate: () => {
        const bounds = itemsLayer.getBoundingClientRect();
        const scaleX = bounds.width / viewBoxWidth;
        const scaleY = bounds.height / viewBoxHeight;
        for (let i = 0; i < items.length; i += 1) {
          const d = (i * spacing + state.offset + pathLen) % pathLen;
          const p = path.getPointAtLength(d);
          const n = path.getPointAtLength((d + 1) % pathLen);
          const angle =
            (Math.atan2(n.y - p.y, n.x - p.x) * 180) / Math.PI;
          const x = (p.x - viewBox.x) * scaleX;
          const y = (p.y - viewBox.y) * scaleY;
          items[i].style.transform = `translate(${x}px, ${y}px) rotate(${angle}deg)`;
        }
      },
    });

    const charEls = charRefs.current.filter(
      (el): el is HTMLSpanElement => el !== null,
    );
    const topEls = topRefs.current.filter((el): el is HTMLElement => el !== null);
    const frontEls = frontRefs.current.filter(
      (el): el is HTMLElement => el !== null,
    );
    const bottomEls = bottomRefs.current.filter(
      (el): el is HTMLElement => el !== null,
    );

    const charsStagger = stagger(60, { start: 0 });
    const tl = createTimeline({
      defaults: {
        ease: "linear",
        loop: true,
        duration: 680,
      },
    });
    tl.add(charEls, { rotateX: -90 }, charsStagger)
      .add(topEls, { opacity: [0.5, 0] }, charsStagger)
      .add(frontEls, { opacity: [1, 0.5] }, charsStagger)
      .add(bottomEls, { opacity: [0.5, 1] }, charsStagger);

    return () => {
      flowAnim.revert();
      tl.revert();
    };
  }, [play]);

  return (
    <div className={styles.pathTemplate3dComposite}>
      <svg
        ref={svgRef}
        viewBox="0 0 400 400"
        className={styles.pathTemplate3dSvg}
        aria-hidden
      >
        <path
          ref={pathRef}
          id={pathId}
          d={RECT_PATH_D}
          fill="none"
          stroke="#94a3b8"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
      <div
        ref={itemsLayerRef}
        className={styles.pathTemplate3dItems}
        aria-label="3D barcode on path"
      >
        {chars.map((char, i) => (
          <span
            key={`barcode3d-${i}`}
            ref={(el) => {
              itemRefs.current[i] = el;
            }}
            className={styles.pathTemplate3dItem}
          >
            <span
              ref={(el) => {
                charRefs.current[i] = el;
              }}
              className={styles.char3d}
            >
              <em
                ref={(el) => {
                  topRefs.current[i] = el;
                }}
                className={`${styles.face} ${styles.faceTop}`}
              >
                {char}
              </em>
              <em
                ref={(el) => {
                  frontRefs.current[i] = el;
                }}
                className={`${styles.face} ${styles.faceFront}`}
              >
                {char}
              </em>
              <em
                ref={(el) => {
                  bottomRefs.current[i] = el;
                }}
                className={`${styles.face} ${styles.faceBottom}`}
              >
                {char}
              </em>
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}

export default function Page() {
  const reduceMotion = useReducedMotion() ?? false;
  const play = !reduceMotion;

  const textOddRef = useRef<HTMLParagraphElement>(null);
  const textEvenRef = useRef<HTMLParagraphElement>(null);

  useTranslateXLoop(
    textOddRef,
    TEXT.odd,
    TEXT.durationMs,
    play,
    TEXT.seekOddMs,
  );
  useTranslateXLoop(textEvenRef, TEXT.even, TEXT.durationMs, play);

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
            <PathTextOnRect play={play} />
          </div>
        </div>
      </section>

      <section className="w-full max-w-4xl space-y-3">
        <h2 className="text-sm font-semibold text-slate-700">
          split htmlTemplate + textPath
        </h2>
        <p className="text-xs text-slate-500">
          clone 風の上下2段トークンを前面に置き、背面で textPath バーコードをループ。
        </p>
        <SplitTemplateWithPathBarcode play={play} />
      </section>

      <section className="w-full max-w-4xl space-y-3">
        <h2 className="text-sm font-semibold text-slate-700">
          textPath上のバーコード + htmlTemplate 3D
        </h2>
        <p className="text-xs text-slate-500">
          バーコード文字そのものがパス上を循環し、各文字は 3D rotateX で切替。
        </p>
        <PathBarcodeTemplate3D play={play} />
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
