import { useEffect, useMemo, useRef, type MutableRefObject } from "react";
import { usePrefersReducedMotion } from "../../lib/usePrefersReducedMotion";
import { GreetingBurstTail } from "./GreetingBurstTail";
import { GreetingBurstViewport } from "./GreetingBurstViewport";
import { useGreetingBurstBgRowScroll } from "./useGreetingBurstBgRowScroll";
import { useGreetingBurstRowCount } from "./useGreetingBurstRowCount";
import styles from "../shared-dev-assets/DevBurstOverlayAnime.module.css";

export type GreetingBurstSectionProps = {
  frontWord?: string;
  bgRowText?: string;
  /** false のとき背景行のスクロール連動アニメを開始しない（ブリッジ進行中など） */
  animationsEnabled?: boolean;
  /** true のとき viewport/tail の背景行レイヤーを描画しない（外部レイヤー使用時） */
  hideBgRows?: boolean;
  /** Bridge: front-word typing を外部スクロール位相で制御する。 */
  bridgeScrollProgressRef?: MutableRefObject<number>;
  bridgeTypingRevealStart?: number;
  bridgeTypingRevealEnd?: number;
  /** true のとき front word の塗りを透明にし、背面レイヤーを文字内部に見せる */
  wordUsesBackdrop?: boolean;
};

export function GreetingBurstSection({
  frontWord = "konchiwa",
  bgRowText = "hi there hello oi",
  animationsEnabled = true,
  hideBgRows = false,
  bridgeScrollProgressRef,
  bridgeTypingRevealStart,
  bridgeTypingRevealEnd,
  wordUsesBackdrop = false,
}: GreetingBurstSectionProps) {
  const reduceMotion = usePrefersReducedMotion();
  const rootRef = useRef<HTMLElement>(null);
  const triggerRef = useRef<HTMLElement>(null);
  const viewportBgLayerRef = useRef<HTMLDivElement>(null);
  const tailBgLayerRef = useRef<HTMLDivElement>(null);
  const measureRowRef = useRef<HTMLParagraphElement>(null);
  const bgRowsRef = useRef<(HTMLParagraphElement | null)[]>([]);

  const bgRowCount = useGreetingBurstRowCount(measureRowRef, viewportBgLayerRef);

  const { viewportRows, tailRows } = useMemo(() => {
    const isMobile =
      typeof window !== "undefined" && window.matchMedia("(max-width: 640px)").matches;
    const stageMin = isMobile ? 160 : 180;
    const share = 100 / stageMin;
    let vp = Math.max(1, Math.round(bgRowCount * share));
    let tail = bgRowCount - vp;
    if (tail < 1 && bgRowCount > 1) {
      tail = 1;
      vp = bgRowCount - tail;
    }
    return { viewportRows: vp, tailRows: Math.max(0, tail) };
  }, [bgRowCount]);

  useGreetingBurstBgRowScroll(rootRef, triggerRef, bgRowsRef, bgRowCount, {
    animationsEnabled,
    reduceMotion,
  });

  useEffect(() => {
    bgRowsRef.current = bgRowsRef.current.slice(0, bgRowCount);
  }, [bgRowCount]);

  return (
    <section ref={rootRef} className={styles.page} aria-label="Greeting">
      <section
        ref={triggerRef}
        className={`${styles.stage} ${hideBgRows ? styles.stageCompact : ""}`}
      >
        <GreetingBurstViewport
          frontWord={frontWord}
          bgRowText={bgRowText}
          hideBgRows={hideBgRows}
          rowCount={viewportRows}
          rowOffset={0}
          bgLayerRef={viewportBgLayerRef}
          measureRowRef={measureRowRef}
          bgRowsRef={bgRowsRef}
          bridgeScrollProgressRef={bridgeScrollProgressRef}
          bridgeTypingRevealStart={bridgeTypingRevealStart}
          bridgeTypingRevealEnd={bridgeTypingRevealEnd}
          wordUsesBackdrop={wordUsesBackdrop}
        />
        <GreetingBurstTail
          hideBgRows={hideBgRows}
          bgRowText={bgRowText}
          rowCount={tailRows}
          rowOffset={viewportRows}
          bgLayerRef={tailBgLayerRef}
          bgRowsRef={bgRowsRef}
        />
      </section>
    </section>
  );
}
