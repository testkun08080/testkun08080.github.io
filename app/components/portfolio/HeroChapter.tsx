import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "motion/react";
import { animate } from "animejs";
import { useId, useLayoutEffect, useRef, useState } from "react";

/**
 * ヒーロー周辺バーコード（SVG textPath + anime.js）の調整はここだけ見ればよい
 */
const HERO_BARCODE = {
  /** startOffset のループ 1 周の長さ（ms）。小さいほど速い */
  durationMs: 22000,
  /** イージング（マルquee は linear 推奨） */
  ease: "linear" as const,
  /** startOffset を何 % から何 % まで動かすか（二重テキストとセット） */
  offsetPct: { from: 0, to: 50 },
  /** バーコード文字のサイズ（SVG <text> の font-size） */
  fontSize: {
    min: "0.5rem",
    preferred: "0.5vw",
    max: "1.23rem",
  },
  letterSpacing: "0.02em",
  fill: "#7f1d1d",
  /** BARCODE_UNIT を何回繰り返すかの下限（実際は path 長に応じて増やす） */
  unitRepeatPerBlock: 36,
  /**
   * path.getTotalLength() / この値 ≒ 1 ブロックあたりの unit 繰り返し回数の目安。
   * 小さくすると周長を埋める文字が増え、空白が出にくい（処理は重くなる）
   */
  pathLenDivisor: 2,
} as const;

const BARCODE_UNIT = "*0123456789ABCDEF*";

/** 周長に対して十分長い 1 ブロック + シーム用に同一ブロックを 2 連結 */
function buildBarcodePathText(pathLen: number): string {
  const bar = `${BARCODE_UNIT} `;
  if (pathLen <= 0) {
    const fallback = bar.repeat(HERO_BARCODE.unitRepeatPerBlock);
    return `${fallback}${fallback}`;
  }
  /** フォント幅のばらつきで欠けるのを防ぐため、周長より少し多めに取る */
  const paddedLen = pathLen * 1.25;
  const repeats = Math.max(
    HERO_BARCODE.unitRepeatPerBlock,
    Math.ceil(paddedLen / HERO_BARCODE.pathLenDivisor),
  );
  const line = bar.repeat(repeats);
  return `${line}${line}`;
}

type Props = {
  className?: string;
};

const BORDER_PATH_D = "M 2 2 L 98 2 L 98 98 L 2 98 Z";

function HeroBarcodePathRing({ paused }: { paused: boolean }) {
  const rawId = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const pathId = `hero-barcode-border-${rawId}`;
  const pathRef = useRef<SVGPathElement>(null);
  const textPathRef = useRef<SVGTextPathElement>(null);
  const [pathText, setPathText] = useState(() => buildBarcodePathText(400));

  /** マウント後＋フォント確定後に path 周長に合わせて文字量を決める */
  useLayoutEffect(() => {
    const path = pathRef.current;
    if (!path) return;
    const apply = () => setPathText(buildBarcodePathText(path.getTotalLength()));
    apply();
    void document.fonts.ready.then(apply);
  }, []);

  useLayoutEffect(() => {
    const tp = textPathRef.current;
    if (!tp || paused) return;

    const state = { offsetPct: HERO_BARCODE.offsetPct.from };

    let anim: ReturnType<typeof animate> | null = null;

    const run = () => {
      anim?.revert();
      anim = null;
      state.offsetPct = HERO_BARCODE.offsetPct.from;
      tp.setAttribute("startOffset", `${HERO_BARCODE.offsetPct.from}%`);

      anim = animate(state, {
        offsetPct: [HERO_BARCODE.offsetPct.from, HERO_BARCODE.offsetPct.to],
        duration: HERO_BARCODE.durationMs,
        ease: HERO_BARCODE.ease,
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
      tp.setAttribute("startOffset", `${HERO_BARCODE.offsetPct.from}%`);
    };
  }, [paused, pathText]);

  return (
    <svg
      className="absolute inset-0 h-full w-full"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden
    >
      <defs>
        <path ref={pathRef} id={pathId} d={BORDER_PATH_D} fill="none" />
      </defs>
      <text className="hero-barcode-svg-text" dominantBaseline="middle">
        <textPath ref={textPathRef} href={`#${pathId}`} startOffset="0%">
          {pathText}
        </textPath>
      </text>
    </svg>
  );
}

export function HeroChapter({ className }: Props) {
  const reduce = useReducedMotion() ?? false;
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const edgeOpacity = useTransform(scrollYProgress, [0, 0.78], [1, 0]);
  const edgeScale = useTransform(scrollYProgress, [0, 1], [1, 2.35]);
  const edgeBlur = useTransform(scrollYProgress, [0, 0.9], [0, 6]);
  const edgeFilter = useTransform(edgeBlur, (b) => `blur(${b}px)`);

  const logoTrans = useTransform(scrollYProgress, [0.0, 0.62], [0, 1]);
  const logoSolid = useTransform(logoTrans, (v) => 1 - v);

  const logoRotate = useTransform(scrollYProgress, [0, 1], [0, 540]);
  /** ヒーロー先頭では 1（中央・自然な大きさ）、スクロールに合わせてわずかに拡大 */
  const logoScale = useTransform(scrollYProgress, [0, 1], [1, 1.32]);
  /** p*(1-p) でスクロール開始・終端では 0 になり、常にビューポート中央基準 */
  const orbitX = useTransform(
    scrollYProgress,
    (p) => Math.cos(p * Math.PI * 7) * p * (1 - p) * 100,
  );
  const orbitY = useTransform(
    scrollYProgress,
    (p) => Math.sin(p * Math.PI * 7) * p * (1 - p) * 100,
  );

  const fs = HERO_BARCODE.fontSize;

  return (
    <section
      ref={containerRef}
      className={className}
      style={{ height: "min(320vh, 2800px)" }}
      aria-label="Hero"
    >
      <div className="sticky top-0 flex h-dvh min-h-dvh w-full flex-col items-center justify-center overflow-hidden px-4">
        {/* 周囲バーコード — textPath のループは anime.js（HERO_BARCODE）。見た目はスクロール連動 */}
        <motion.div
          className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center"
          style={{
            opacity: edgeOpacity,
            scale: edgeScale,
            filter: edgeFilter,
          }}
        >
          <div className="hero-barcode-frame">
            <HeroBarcodePathRing paused={reduce} />
          </div>
        </motion.div>

        {/* 中央ロゴ — スクロールで orbit + 拡大、solid → trans */}
        <motion.div
          className="relative z-10 mx-auto flex w-full max-w-[min(32vw,180px)] shrink-0 flex-col items-center justify-center sm:max-w-[min(36vw,100px)]"
          style={{
            x: orbitX,
            y: orbitY,
            rotate: reduce ? 0 : logoRotate,
            scale: logoScale,
          }}
        >
          <div className="relative aspect-1595/2155 w-full">
            <motion.img
              src="/logo.svg"
              alt=""
              className="absolute inset-0 h-full w-full object-contain object-center"
              style={{ opacity: logoSolid }}
              draggable={false}
            />
            <motion.img
              src="/logo-trans.svg"
              alt=""
              className="absolute inset-0 h-full w-full object-contain object-center"
              style={{ opacity: logoTrans }}
              draggable={false}
            />
          </div>
        </motion.div>
      </div>

      <style>{`
        .hero-barcode-svg-text {
          font-family: "Libre Barcode 39", ui-monospace, monospace;
          font-size: clamp(${fs.min}, ${fs.preferred}, ${fs.max});
          line-height: 1;
          letter-spacing: ${HERO_BARCODE.letterSpacing};
          fill: ${HERO_BARCODE.fill};
        }

        .hero-barcode-frame {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      `}</style>
    </section>
  );
}
