import { animate, createDraggable } from "animejs";
import { useEffect, useRef } from "react";
import { usePageContext } from "vike-react/usePageContext";
import styles from "./ErrorPage.module.css";

export default function Page() {
  const { is404 } = usePageContext();
  const splitHeadingRef = useRef<HTMLHeadingElement>(null);
  const draggableImageRef = useRef<HTMLImageElement>(null);
  const dragAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!is404) return;
    const heading = splitHeadingRef.current;
    const image = draggableImageRef.current;
    const dragArea = dragAreaRef.current;
    if (!heading || !image || !dragArea) return;

    const chars = ["4", "0", "#", "?", "X"];
    const runScramble = () => {
      let frame = 0;
      const scrambleId = window.setInterval(() => {
        frame += 1;
        heading.textContent = Array.from({ length: 3 }, (_, i) => {
          if (i < frame - 2) return "404"[i];
          return chars[Math.floor(Math.random() * chars.length)];
        }).join("");
        if (frame > 5) {
          window.clearInterval(scrambleId);
          heading.textContent = "404";
        }
      }, 70);

      animate(heading, {
        scale: [1, 1.08, 1],
        rotateZ: [0, -2, 0],
        duration: 540,
        ease: "out(3)",
      });
    };

    runScramble();
    const scrambleLoopId = window.setInterval(runScramble, 2000);

    const draggable = createDraggable(image, {
      container: dragArea,
      releaseEase: "out(3)",
    });

    return () => {
      window.clearInterval(scrambleLoopId);
      heading.textContent = "404";
      if (typeof (draggable as { revert?: () => void }).revert === "function") {
        (draggable as { revert: () => void }).revert();
      }
    };
  }, [is404]);

  if (is404) {
    return (
      <main className={styles.page}>
        <section className={styles.card}>
          <h1 ref={splitHeadingRef} className={styles.errorCode}>
            404
          </h1>

          <div ref={dragAreaRef} className={styles.dragArea}>
            <img
              ref={draggableImageRef}
              src="/heyhey.png"
              alt="heyhey cat"
              className={styles.draggableImage}
            />
          </div>

          <p className={styles.message}>
            大変申し訳ございません。
            <br />
            精一杯努力いたしまいたが、お探しのページを見つけることはできませんでした。
            <br />
            大変恐れ入りますが、ホームへ戻る事をご検討ください。
          </p>

          <a href="/" className={styles.homeButton}>
            トップへ戻る
          </a>
        </section>
      </main>
    );
  }
  return (
    <main className={styles.page}>
      <section className={styles.errorCard}>
        <h1 className={styles.errorTitle}>エラー</h1>
        <p className={styles.errorBody}>問題が発生しました。</p>
      </section>
    </main>
  );
}
