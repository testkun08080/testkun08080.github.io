import { useEffect, useMemo, useRef } from "react";
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
};

export function GreetingBurstSection({
  frontWord = "konchiwa",
  bgRowText = "hi there hello oi",
  animationsEnabled = true,
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
      <section ref={triggerRef} className={styles.stage}>
        <GreetingBurstViewport
          frontWord={frontWord}
          bgRowText={bgRowText}
          rowCount={viewportRows}
          rowOffset={0}
          bgLayerRef={viewportBgLayerRef}
          measureRowRef={measureRowRef}
          bgRowsRef={bgRowsRef}
        />
        <GreetingBurstTail
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
