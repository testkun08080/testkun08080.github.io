import { animate, createScope, onScroll } from "animejs";
import { useEffect, type MutableRefObject, type RefObject } from "react";

export function useGreetingBurstBgRowScroll(
  rootRef: RefObject<HTMLElement | null>,
  triggerRef: RefObject<HTMLElement | null>,
  bgRowsRef: MutableRefObject<(HTMLParagraphElement | null)[]>,
  bgRowCount: number,
  options: { animationsEnabled: boolean; reduceMotion: boolean },
) {
  const { animationsEnabled, reduceMotion } = options;

  useEffect(() => {
    if (!rootRef.current) return;

    const triggerEl = triggerRef.current;
    const rows = bgRowsRef.current.slice(0, bgRowCount).filter(Boolean) as HTMLParagraphElement[];
    if (!triggerEl || rows.length === 0) return;

    if (reduceMotion || !animationsEnabled) {
      rows.forEach((row) => {
        row.style.opacity = reduceMotion ? "0.9" : "0.82";
        row.style.transform = "translateX(0px)";
      });
      return;
    }

    const scope = createScope({ root: rootRef.current }).add(() => {
      rows.forEach((row, i) => {
        const direction = i % 2 === 0 ? -1 : 1;
        animate(row, {
          translateX: [window.innerWidth * 0.45 * direction, 0],
          opacity: [0.15, 0.82],
          duration: 1000,
          delay: i * 100,
          ease: "linear",
          autoplay: onScroll({
            enter: "bottom top",
            leave: "top bottom",
            sync: true,
            repeat: true,
          }),
        });
      });
    });

    return () => {
      scope.revert();
    };
  }, [animationsEnabled, bgRowCount, reduceMotion, rootRef, triggerRef]);
}
