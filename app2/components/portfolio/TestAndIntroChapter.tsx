import { motion, useInView, useScroll, useTransform } from "motion/react";
import { useEffect, useId, useMemo, useRef, useState } from "react";

type Props = {
  className?: string;
};

function rand(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export function TestAndIntroChapter({ className }: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const typingRef = useRef<HTMLDivElement>(null);
  const uid = useId();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const chaosOpacity = useTransform(scrollYProgress, [0.08, 0.38], [1, 0]);
  const clusterOpacity = useTransform(scrollYProgress, [0.32, 0.58], [0, 1]);

  const specs = useMemo(
    () =>
      Array.from({ length: 48 }, (_, i) => ({
        id: i,
        x: rand(i) * 92 + 4,
        y: rand(i + 17) * 88 + 6,
        size: 10 + rand(i + 3) * 28,
        rot: rand(i + 5) * 40 - 20,
        opacity: 0.35 + rand(i + 7) * 0.55,
      })),
    [],
  );

  const whiteSpecs = useMemo(
    () =>
      Array.from({ length: 36 }, (_, i) => ({
        id: i,
        x: rand(i + 99) * 90 + 5,
        y: rand(i + 33) * 86 + 7,
        size: 7 + rand(i + 11) * 9,
      })),
    [],
  );

  const typingInView = useInView(typingRef, { once: true, amount: 0.45 });

  const [line1, setLine1] = useState("");
  const [line2, setLine2] = useState("");
  const [showBio, setShowBio] = useState(false);
  const [typingDone, setTypingDone] = useState(false);

  useEffect(() => {
    if (!typingInView) return;
    let cancelled = false;

    const delay = (ms: number) => new Promise<void>((r) => window.setTimeout(r, ms));

    const run = async () => {
      const t1 = "konchiwa";
      for (let i = 1; i <= t1.length; i++) {
        if (cancelled) return;
        setLine1(t1.slice(0, i));
        await delay(78);
      }
      setTypingDone(true);
      await delay(420);
      const t2 = "hi there";
      for (let i = 1; i <= t2.length; i++) {
        if (cancelled) return;
        setLine2(t2.slice(0, i));
        await delay(64);
      }
      await delay(500);
      if (!cancelled) setShowBio(true);
    };

    void run();
    return () => {
      cancelled = true;
    };
  }, [typingInView]);

  return (
    <section ref={sectionRef} className={`relative ${className ?? ""}`} aria-label="Test and intro">
      <div className="relative" style={{ height: "min(220vh, 2000px)" }}>
        <div className="sticky top-0 flex h-[100dvh] flex-col overflow-hidden bg-[#f7efe4]">
          <div
            className="absolute inset-0 opacity-40"
            style={{
              backgroundImage: "url(/images/hero.png)",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          <div className="absolute inset-0 bg-[#faf6ed]/90" />

          <motion.div className="relative z-10 flex h-full w-full flex-col" style={{ opacity: chaosOpacity }}>
            <div className="relative flex-1">
              {specs.map((s) => (
                <span
                  key={`${uid}-c-${s.id}`}
                  className="absolute font-black uppercase text-[#b91c1c]"
                  style={{
                    left: `${s.x}%`,
                    top: `${s.y}%`,
                    fontSize: `${s.size}px`,
                    transform: `translate(-50%, -50%) rotate(${s.rot}deg)`,
                    opacity: s.opacity,
                  }}
                >
                  test
                </span>
              ))}
              <span
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-black uppercase text-[#b91c1c]"
                style={{ fontSize: "clamp(4rem, 18vw, 14rem)", lineHeight: 0.85 }}
              >
                test
              </span>
            </div>
          </motion.div>

          <motion.div
            className="pointer-events-none absolute inset-0 z-20"
            style={{ opacity: clusterOpacity }}
          >
            {whiteSpecs.map((s) => (
              <span
                key={`${uid}-w-${s.id}`}
                className="absolute font-bold uppercase text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.35)]"
                style={{
                  left: `${s.x}%`,
                  top: `${s.y}%`,
                  fontSize: `${s.size}px`,
                  transform: "translate(-50%, -50%)",
                }}
              >
                test
              </span>
            ))}
          </motion.div>
        </div>
      </div>

      <div
        ref={typingRef}
        className="relative flex min-h-[100dvh] flex-col items-center justify-center gap-10 bg-[#f3eadc] px-6 py-24"
      >
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: "url(/images/hero.png)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 bg-[#faf6ed]/92" />

        <div className="relative z-10 flex min-h-[40vh] w-full max-w-lg flex-col items-center">
          <p className="min-h-[1.4em] w-full text-center font-mono text-3xl font-semibold tracking-tight text-[#0f0f0f] sm:text-4xl">
            {line1}
            {!typingDone ? <span className="inline-block w-2 animate-pulse">▍</span> : null}
          </p>
          {line2.length > 0 || showBio ? (
            <p className="mt-4 min-h-[1.6em] w-full text-center font-mono text-xl text-[#1e293b] sm:text-2xl">
              {line2}
              {line2.length > 0 && line2 !== "hi there" ? (
                <span className="inline-block w-2 animate-pulse">▍</span>
              ) : null}
            </p>
          ) : null}
          {showBio ? (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="mt-12 max-w-[min(52ch,100%)] text-center text-base leading-relaxed text-[#0f172a]"
            >
              <span className="font-semibold text-[#991b1b]">自己紹介</span>
              <br />
              <br />
              ここにプロフィール文を入れます。職種・得意領域・現在の関心など、あとでデザインに合わせて編集してください。
            </motion.div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
