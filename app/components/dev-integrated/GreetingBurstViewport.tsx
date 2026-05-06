import type { MutableRefObject, RefObject } from "react";
import { ScrollTypingHeading } from "./ScrollTypingHeading";
import styles from "../shared-dev-assets/DevBurstOverlayAnime.module.css";

const ROW_REPEAT = 15;

export type GreetingBurstViewportProps = {
  frontWord: string;
  /** true 指定で、繰り返し背景行レイヤー（bgLayer）の描画を省略し、フロント語のみを表示する。
   *  バーコード〜挨拶ブリッジでは、カーテン側のテキストが背景文字を兼ねるため有効化する。 */
  hideBgRows?: boolean;
  bgRowText?: string;
  /** このビューポートが描画する行数 */
  rowCount?: number;
  /** bgRowsRef 上の開始インデックス */
  rowOffset?: number;
  bgLayerRef?: RefObject<HTMLDivElement | null>;
  measureRowRef?: RefObject<HTMLParagraphElement | null>;
  bgRowsRef?: MutableRefObject<(HTMLParagraphElement | null)[]>;
  /** Greeting / barcode bridge: drive front-word typing from unified scroll phase [0–1]. */
  bridgeScrollProgressRef?: MutableRefObject<number>;
  bridgeTypingRevealStart?: number;
  bridgeTypingRevealEnd?: number;
  /** true のとき front word は透明塗りで背面のカーテン文字を見せる */
  wordUsesBackdrop?: boolean;
};

export function GreetingBurstViewport({
  frontWord,
  hideBgRows = false,
  bgRowText = "",
  rowCount = 0,
  rowOffset = 0,
  bgLayerRef,
  measureRowRef,
  bgRowsRef,
  bridgeScrollProgressRef,
  bridgeTypingRevealStart,
  bridgeTypingRevealEnd,
  wordUsesBackdrop = false,
}: GreetingBurstViewportProps) {
  const lineText = Array.from({ length: ROW_REPEAT }, () => bgRowText).join(" ");

  return (
    <div className={styles.viewportShell}>
      {!hideBgRows ? (
        <div ref={bgLayerRef} className={styles.bgLayer}>
          <p ref={measureRowRef} className={`${styles.bgRow} ${styles.measureRow}`} aria-hidden>
            {bgRowText}
          </p>
          {Array.from({ length: rowCount }).map((_, localIdx) => {
            const globalIdx = rowOffset + localIdx;
            return (
              <p
                key={`vp-row-${globalIdx}`}
                ref={(el) => {
                  if (bgRowsRef) bgRowsRef.current[globalIdx] = el;
                }}
                className={styles.bgRow}
              >
                {lineText}
              </p>
            );
          })}
        </div>
      ) : null}

      <div className={styles.frontLayer}>
        <ScrollTypingHeading
          text={frontWord}
          headingClassName={`${styles.word} ${wordUsesBackdrop ? styles.wordBackdropFill : ""}`}
          underlineClassName={styles.underline}
          {...(bridgeScrollProgressRef
            ? {
                bridgeScrollProgressRef,
                ...(bridgeTypingRevealStart !== undefined
                  ? { bridgeTypingRevealStart }
                  : {}),
                ...(bridgeTypingRevealEnd !== undefined ? { bridgeTypingRevealEnd } : {}),
              }
            : {})}
        />
      </div>
    </div>
  );
}
