import type { RefObject, MutableRefObject } from "react";
import styles from "../shared-dev-assets/DevBurstOverlayAnime.module.css";

const ROW_REPEAT = 15;

export type GreetingBurstTailProps = {
  bgRowText?: string;
  rowCount?: number;
  rowOffset?: number;
  bgLayerRef?: RefObject<HTMLDivElement | null>;
  bgRowsRef?: MutableRefObject<(HTMLParagraphElement | null)[]>;
  /** true 指定で、繰り返し背景行レイヤー（bgLayer）の描画を省略する。
   *  バーコード〜挨拶ブリッジではカーテン側のテキストが代替するため、テイル自体を描画しない。 */
  hideBgRows?: boolean;
};

export function GreetingBurstTail({
  bgRowText = "",
  rowCount = 0,
  rowOffset = 0,
  bgLayerRef,
  bgRowsRef,
  hideBgRows = false,
}: GreetingBurstTailProps) {
  if (hideBgRows) return null;
  if (rowCount <= 0) return null;

  const lineText = Array.from({ length: ROW_REPEAT }, () => bgRowText).join(" ");

  return (
    <div className={styles.tailShell}>
      <div ref={bgLayerRef} className={styles.bgLayer}>
        {Array.from({ length: rowCount }).map((_, localIdx) => {
          const globalIdx = rowOffset + localIdx;
          return (
            <p
              key={`tail-row-${globalIdx}`}
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
    </div>
  );
}
