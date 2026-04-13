import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

const DOCS = [2, 3, 4, 5] as const;

type Props = {
  className?: string;
};

export function DocumentChapter({ className }: Props) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const op0 = useTransform(scrollYProgress, [0, 0.06, 0.22, 0.28], [0, 1, 1, 0]);
  const op1 = useTransform(scrollYProgress, [0.22, 0.28, 0.47, 0.53], [0, 1, 1, 0]);
  const op2 = useTransform(scrollYProgress, [0.47, 0.53, 0.72, 0.78], [0, 1, 1, 0]);
  const op3 = useTransform(scrollYProgress, [0.72, 0.78, 1], [0, 1, 1]);

  const ops = [op0, op1, op2, op3];

  return (
    <section
      ref={ref}
      className={className}
      style={{ height: "min(420vh, 3600px)" }}
      aria-label="Document sequence"
    >
      <div className="sticky top-0 flex h-[100dvh] flex-col items-center justify-center overflow-hidden bg-[#f7efe4]">
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: "url(/images/hero.png)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 bg-[#faf6ed]/85" />

        <p className="relative z-10 mb-4 text-[10px] font-semibold uppercase tracking-[0.45em] text-[#991b1b]">
          document 2 → 5
        </p>

        <div className="relative z-10 flex h-[min(72vh,720px)] w-full max-w-5xl items-center justify-center px-4">
          {DOCS.map((n, i) => (
            <motion.img
              key={n}
              src={`/images/Document${n}.png`}
              alt=""
              className="absolute max-h-full max-w-full object-contain drop-shadow-xl"
              style={{ opacity: ops[i] }}
              draggable={false}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
