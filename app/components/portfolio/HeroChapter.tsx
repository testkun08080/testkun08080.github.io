import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "motion/react";
import { useRef } from "react";
import { PathBarcodeTemplate3D } from "./PathBarcodeTemplate3D";

/**
 * ヒーロー周辺バーコード（SVG textPath + anime.js）の調整はここだけ見ればよい
 */
const HERO_BARCODE = {
  /** バーコード文字のサイズ（SVG <text> の font-size） */
  fontSize: {
    min: "0.5rem",
    preferred: "1.5vw",
    max: "1.23rem",
  },
  letterSpacing: "0.02em",
  fill: "#7f1d1d",
} as const;

type Props = {
  className?: string;
};

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
      // style={{ height: "min(320vh, 2800px)" }}
      aria-label="Hero"
    >
      <div className="sticky top-0 flex h-dvh min-h-dvh w-full flex-col items-center justify-center overflow-hidden px-4">
        {/* 周囲バーコード — 3D barcode のループは anime.js。見た目はスクロール連動 */}
        <motion.div
          className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center"
          style={{
            opacity: edgeOpacity,
            scale: edgeScale,
            filter: edgeFilter,
          }}
        >
          <div className="hero-barcode-frame">
            <PathBarcodeTemplate3D
              paused={reduce}
              className="hero-barcode-svg-text hero-barcode-template3d-theme"
              flowDurationMs={33000}
              textUnit="*0123456789ABCDEF* "
              textRepeat={11}
              pathD="
              M 8 2
              H 92
              Q 98 2 98 8
              V 92
              Q 98 98 92 98
              H 8
              Q 2 98 2 92
              V 8
              Q 2 2 8 2
              Z
            "
            />
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
            {/* <motion.img
              src="/logo.svg"
              alt=""
              className="absolute inset-0 h-full w-full object-contain object-center"
              style={{ opacity: logoSolid }}
              draggable={false}
            /> */}
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

        .hero-barcode-template3d {
          position: absolute;
          inset: 0;
        }

        .hero-barcode-template3d-svg {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
        }

        .hero-barcode-template3d-path {
          stroke: #7f1d1d;
          stroke-width: 0.3;
          stroke-linejoin: round;
          opacity: 0;
        }

        .hero-barcode-template3d-items {
          position: absolute;
          inset: 0;
          perspective: 640px;
        }

        .hero-barcode-template3d-item {
          position: absolute;
          left: 0;
          top: 0;
          transform-origin: 0 0;
        }

        .hero-barcode-template3d-char {
          position: relative;
          display: inline-block;
          line-height: 1;
          transform-style: preserve-3d;
          transform-origin: 50% 50% 0.5rem;
          color: ${HERO_BARCODE.fill};
        }

        .hero-barcode-template3d-face {
          position: absolute;
          left: 0;
          display: inline-block;
          font-style: normal;
        }

        .hero-barcode-template3d-face-front {
          position: relative;
          opacity: 1;
        }

        .hero-barcode-template3d-face-bottom {
          top: 100%;
          transform-origin: 50% 0%;
          transform: rotateX(90deg);
          opacity: 0.5;
        }

        .hero-barcode-template3d-face-top {
          bottom: 100%;
          transform-origin: 50% 100%;
          transform: rotateX(-90deg);
          opacity: 0.5;
        }

        @media (max-width: 640px) {
          .hero-barcode-svg-text {
            font-size: clamp(0.78rem, 5.2vw, 1.1rem);
          }
        }
      `}</style>
    </section>
  );
}
