import { animate, createScope, onScroll } from "animejs";
import { useEffect, useRef, useState } from "react";
import styles from "./DevAnimeOnscrollDebug.module.css";

type DebugSnapshot = {
  progress: number | null;
  event: string;
  values: Record<string, string | number | boolean | null>;
  updatedAt: string;
};
const TYPING_TEXT = "progress drives this typing demo";

function pickObserverValues(observer: unknown) {
  const source = observer as Record<string, unknown>;
  const result: Record<string, string | number | boolean | null> = {};
  const keys = [
    "progress",
    "currentTime",
    "iterationCurrentTime",
    "iterationProgress",
    "deltaTime",
    "speed",
    "direction",
    "reversed",
    "paused",
    "began",
    "completed",
  ];

  keys.forEach((key) => {
    const value = source[key];
    if (
      typeof value === "string" ||
      typeof value === "number" ||
      typeof value === "boolean" ||
      value === null
    ) {
      result[key] = value;
    }
  });

  return result;
}

export default function Page() {
  const rootRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const scopeRef = useRef<ReturnType<typeof createScope> | null>(null);
  const lastUpdateMsRef = useRef(0);
  const [snapshot, setSnapshot] = useState<DebugSnapshot>({
    progress: null,
    event: "init",
    values: {},
    updatedAt: "-",
  });
  const [typedText, setTypedText] = useState("");

  useEffect(() => {
    if (!rootRef.current || !trackRef.current || !boxRef.current) return;
    const track = trackRef.current;
    const box = boxRef.current;

    const logObserver = (event: string, observer: unknown) => {
      const values = pickObserverValues(observer);
      console.log(`[onScroll:${event}]`, {
        values,
        observer,
      });
    };

    const updateSnapshot = (event: string, observer: unknown) => {
      const values = pickObserverValues(observer);
      const progressValue = values.progress;
      const progress =
        typeof progressValue === "number" ? Number(progressValue.toFixed(4)) : null;
      if (typeof progressValue === "number") {
        const clamped = Math.min(Math.max(progressValue, 0), 1);
        const charCount = Math.floor(clamped * TYPING_TEXT.length);
        setTypedText(TYPING_TEXT.slice(0, charCount));
      }
      setSnapshot({
        progress,
        event,
        values,
        updatedAt: new Date().toLocaleTimeString(),
      });
    };

    scopeRef.current = createScope({ root: rootRef.current }).add(() => {
      animate(box, {
        rotate: "1turn",
        x: ["-36vw", "36vw"],
        scale: [0.84, 1.24],
        ease: "linear",
        autoplay: onScroll({
          target: track,
          enter: "top top",
          leave: "bottom bottom",
          sync: true,
          debug: true,
          onEnter: (self) => {
            logObserver("onEnter", self);
            updateSnapshot("onEnter", self);
          },
          onLeave: (self) => {
            logObserver("onLeave", self);
            updateSnapshot("onLeave", self);
          },
          onEnterForward: (self) => {
            logObserver("onEnterForward", self);
            updateSnapshot("onEnterForward", self);
          },
          onEnterBackward: (self) => {
            logObserver("onEnterBackward", self);
            updateSnapshot("onEnterBackward", self);
          },
          onLeaveForward: (self) => {
            logObserver("onLeaveForward", self);
            updateSnapshot("onLeaveForward", self);
          },
          onLeaveBackward: (self) => {
            logObserver("onLeaveBackward", self);
            updateSnapshot("onLeaveBackward", self);
          },
          onUpdate: (self) => {
            const now = performance.now();
            if (now - lastUpdateMsRef.current < 60) return;
            lastUpdateMsRef.current = now;
            logObserver("onUpdate", self);
            updateSnapshot("onUpdate", self);
          },
        }),
      });
    });

    return () => {
      scopeRef.current?.revert();
      scopeRef.current = null;
    };
  }, []);

  return (
    <main ref={rootRef} className={styles.page}>
      <section className={styles.hero}>
        <h1 className={styles.title}>dev-anime-onscroll-debug</h1>
        <p className={styles.copy}>
          <code>onScroll</code> の callback で受ける値を可視化するデバッグページです。
          画面右上のパネルで <code>progress</code> や現在のイベント名を確認できます。
        </p>
      </section>

      <section ref={trackRef} className={styles.track}>
        <div className={styles.stickyStage}>
          <div className={styles.stageGuide}>Scroll Area</div>
          <div ref={boxRef} className={styles.box}>
            progress-driven box
          </div>
          <p className={styles.typingLine} aria-live="polite">
            {typedText}
            <span className={styles.caret} aria-hidden="true">
              |
            </span>
          </p>
        </div>
      </section>

      <aside className={styles.panel} aria-live="polite">
        <p className={styles.panelTitle}>onScroll debug</p>
        <p className={styles.panelLine}>
          event: <strong>{snapshot.event}</strong>
        </p>
        <p className={styles.panelLine}>
          progress: <strong>{snapshot.progress ?? "-"}</strong>
        </p>
        <p className={styles.panelLine}>updated: {snapshot.updatedAt}</p>
        <pre className={styles.pre}>{JSON.stringify(snapshot.values, null, 2)}</pre>
      </aside>
    </main>
  );
}
