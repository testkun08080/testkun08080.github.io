import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import { useRef } from "react";

const RING_PHRASE = "CREATIVE · VISUAL · DIGITAL · ";

type Props = {
  className?: string;
};

export function HeroChapter({ className }: Props) {
  const reduce = useReducedMotion();
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const edgeOpacity = useTransform(scrollYProgress, [0, 0.78], [1, 0]);
  const edgeScale = useTransform(scrollYProgress, [0, 1], [1, 2.35]);
  const edgeBlur = useTransform(scrollYProgress, [0, 0.9], [0, 6]);
  const edgeFilter = useTransform(edgeBlur, (b) => `blur(${b}px)`);

  const logoTrans = useTransform(scrollYProgress, [0.28, 0.62], [0, 1]);
  const logoSolid = useTransform(logoTrans, (v) => 1 - v);

  const logoRotate = useTransform(scrollYProgress, [0, 1], [0, 540]);
  const logoScale = useTransform(scrollYProgress, [0, 1], [0.82, 1.38]);
  const orbitX = useTransform(scrollYProgress, (p) => Math.cos(p * Math.PI * 7) * (1 - p) * 100);
  const orbitY = useTransform(scrollYProgress, (p) => Math.sin(p * Math.PI * 7) * (1 - p) * 100);

  const count = 18;

  return (
    <section
      ref={containerRef}
      className={className}
      style={{ height: "min(320vh, 2800px)" }}
      aria-label="Hero"
    >
      <div className="sticky top-0 flex h-[100dvh] flex-col items-center justify-center overflow-hidden">
        {/* hero トーン */}
        <div
          className="absolute inset-0 bg-[#e8dcc8]"
          style={{
            backgroundImage: "url(/images/hero.png)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 bg-[#c4a574]/25 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#f5ebe0]/40 via-transparent to-[#2a1810]/35" />

        {/* 周囲の赤文字 — 常時グルグル + スクロールでズームアウトして消える */}
        <motion.div
          className="pointer-events-none absolute inset-0 flex items-center justify-center"
          style={{
            opacity: edgeOpacity,
            scale: edgeScale,
            filter: edgeFilter,
          }}
        >
          <div className={`hero-ring-spin relative h-[min(140vw,140vh)] w-[min(140vw,140vh)]`}>
            {Array.from({ length: count }).map((_, i) => (
              <span
                key={i}
                className="absolute left-1/2 top-1/2 origin-center whitespace-nowrap font-bold uppercase tracking-[0.35em] text-[#b91c1c] [text-shadow:0_0_1px_rgba(0,0,0,0.15)]"
                style={{
                  fontSize: "clamp(9px, 1.05vw, 13px)",
                  transform: `rotate(${(360 / count) * i}deg) translateY(min(-42vw, -46vh)) rotate(${(-360 / count) * i}deg)`,
                }}
              >
                {RING_PHRASE}
              </span>
            ))}
          </div>
        </motion.div>

        {/* 中央ロゴ — スクロールで orbit + 拡大、solid → trans */}
        <motion.div
          className="relative z-10 w-[min(52vw,280px)]"
          style={{
            x: orbitX,
            y: orbitY,
            rotate: reduce ? 0 : logoRotate,
            scale: logoScale,
          }}
        >
          <div className="relative aspect-[1595/2155] w-full">
            <motion.img
              src="/logo.svg"
              alt=""
              className="absolute inset-0 h-full w-full object-contain"
              style={{ opacity: logoSolid }}
              draggable={false}
            />
            <motion.img
              src="/logo-trans.svg"
              alt=""
              className="absolute inset-0 h-full w-full object-contain"
              style={{ opacity: logoTrans }}
              draggable={false}
            />
          </div>
          <p className="mt-4 text-center text-[10px] font-medium uppercase tracking-[0.4em] text-[#7f1d1d]/80">
            scroll · formation
          </p>
        </motion.div>
      </div>

      <style>{`
        @keyframes heroRingSpin {
          to { transform: rotate(360deg); }
        }
        .hero-ring-spin {
          animation: heroRingSpin 72s linear infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .hero-ring-spin { animation: none; }
        }
      `}</style>
    </section>
  );
}
