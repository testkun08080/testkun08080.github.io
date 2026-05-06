import { useEffect, useState, type RefObject } from "react";

const INITIAL_BG_ROW_COUNT = 14;

export function useGreetingBurstRowCount(
  measureRowRef: RefObject<HTMLParagraphElement | null>,
  viewportBgLayerRef: RefObject<HTMLDivElement | null>,
) {
  const [bgRowCount, setBgRowCount] = useState(INITIAL_BG_ROW_COUNT);

  useEffect(() => {
    let rafId = 0;
    const updateBgRowCount = () => {
      if (typeof window === "undefined") return;
      const measuredRow = measureRowRef.current;
      const bgLayer = viewportBgLayerRef.current;
      if (!measuredRow || !bgLayer) return;
      const rowHeight = measuredRow.getBoundingClientRect().height;
      if (rowHeight <= 0) return;
      const layerStyles = window.getComputedStyle(bgLayer);
      const rowGap = Number.parseFloat(layerStyles.rowGap || "0") || 0;
      const rowPitch = rowHeight + rowGap;
      const isMobile = window.matchMedia("(max-width: 640px)").matches;
      const minRows = isMobile ? 10 : 12;
      const maxRows = isMobile ? 16 : 24;
      const buffer = isMobile ? 1 : 2;
      const viewportHeight = window.innerHeight;
      const desired = Math.ceil(viewportHeight / rowPitch) + buffer;
      const nextCount = Math.min(maxRows, Math.max(minRows, desired));
      setBgRowCount((prev) => (prev === nextCount ? prev : nextCount));
    };

    const scheduleUpdate = () => {
      cancelAnimationFrame(rafId);
      rafId = window.requestAnimationFrame(updateBgRowCount);
    };

    scheduleUpdate();
    window.addEventListener("resize", scheduleUpdate);
    window.addEventListener("orientationchange", scheduleUpdate);
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", scheduleUpdate);
      window.removeEventListener("orientationchange", scheduleUpdate);
    };
  }, []);

  return bgRowCount;
}
