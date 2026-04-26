import { animate, createTimeline } from "animejs";
import { useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";
import styles from "./DevScrollTyping.module.css";

const LINES = [
  "$ pnpm install",
  "Packages: +123",
  "$ pnpm dev",
  "Local: http://localhost:5173/",
  "ready in 824ms",
] as const;

function useScrollStartTyping(
  triggerRef: React.RefObject<HTMLElement | null>,
  lineRefs: React.RefObject<(HTMLParagraphElement | null)[]>,
  caretRefs: React.RefObject<(HTMLSpanElement | null)[]>,
  enabled: boolean,
) {
  useEffect(() => {
    const triggerEl = triggerRef.current;
    if (!triggerEl || !enabled) return;

    let started = false;
    const cleanups: Array<() => void> = [];

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (!entry || !entry.isIntersecting || started) return;
        started = true;

        const timeline = createTimeline({ defaults: { ease: "linear" } });
        lineRefs.current.forEach((lineEl, index) => {
          const caretEl = caretRefs.current[index];
          if (!lineEl) return;

          const targetText = lineEl.dataset.text ?? "";
          lineEl.textContent = "";

          const state = { count: 0 };
          timeline.add(state, {
            count: targetText.length,
            duration: Math.max(500, targetText.length * 45),
            onBegin: () => {
              if (caretEl) caretEl.style.opacity = "1";
            },
            onUpdate: () => {
              lineEl.textContent = targetText.slice(0, Math.round(state.count));
            },
            onComplete: () => {
              if (caretEl) caretEl.style.opacity = "0";
            },
          });
          timeline.add({}, { duration: 180 });
        });

        timeline.play();
        cleanups.push(() => timeline.revert());
        observer.disconnect();
      },
      { threshold: 0.45 },
    );

    observer.observe(triggerEl);

    return () => {
      observer.disconnect();
      cleanups.forEach((dispose) => dispose());
    };
  }, [triggerRef, lineRefs, caretRefs, enabled]);
}

export default function Page() {
  const reduceMotion = useReducedMotion() ?? false;
  const triggerRef = useRef<HTMLElement>(null);
  const lineRefs = useRef<(HTMLParagraphElement | null)[]>([]);
  const caretRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useScrollStartTyping(triggerRef, lineRefs, caretRefs, !reduceMotion);

  return (
    <main className="bg-slate-950 text-slate-100">
      <section className="mx-auto flex min-h-dvh max-w-4xl flex-col items-center justify-center gap-4 px-6 text-center">
        <h1 className="text-2xl font-bold tracking-tight">dev-scroll-typing</h1>
        <p className="max-w-xl text-sm text-slate-300">
          下へスクロールして、カードが見えた瞬間にタイピングが始まるデモです。
        </p>
        <p className="text-xs text-slate-400">Scroll Down</p>
      </section>

      <section
        ref={triggerRef}
        className="mx-auto flex min-h-dvh max-w-4xl items-center justify-center px-6 py-20"
      >
        <div className="w-full max-w-2xl rounded-xl border border-slate-700 bg-slate-900/80 p-5 shadow-2xl backdrop-blur">
          <div className="mb-4 flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
          </div>

          <div className="space-y-2">
            {LINES.map((line, index) => (
              <p
                key={line}
                ref={(el) => {
                  lineRefs.current[index] = el;
                }}
                data-text={line}
                className={styles.codeLine}
              >
                {reduceMotion ? line : ""}
                <span
                  ref={(el) => {
                    caretRefs.current[index] = el;
                  }}
                  className={styles.caret}
                  aria-hidden="true"
                />
              </p>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto flex min-h-[70dvh] max-w-4xl flex-col items-center justify-center gap-3 px-6 py-16 text-center">
        <p className="text-sm text-slate-300">
          anime.js で1文字ずつ表示し、CSS でカーソル点滅を作っています。
        </p>
        <a
          href="/dev"
          className="text-sm text-slate-300 underline underline-offset-4 hover:text-white"
        >
          /dev に戻る
        </a>
      </section>
    </main>
  );
}
