export type ScrollObserverSelf = { progress?: number };

export type ScrollRunOnceLatch = { completed: boolean };

export function createScrollRunOnceLatch(): ScrollRunOnceLatch {
  return { completed: false };
}

export function getScrollProgress(self: unknown): number {
  const observer = self as ScrollObserverSelf;
  if (typeof observer.progress !== "number") return 0;
  return Math.min(Math.max(observer.progress, 0), 1);
}

/**
 * Returns true when the scroll reveal has latched at completion.
 * Calls `onLatch` the first time progress reaches 1.
 * After latch, calls `onMaintain` on subsequent updates (if provided).
 */
export function handleScrollRunOnceUpdate(
  latch: ScrollRunOnceLatch,
  self: unknown,
  onLatch: () => void,
  onMaintain?: () => void,
): boolean {
  if (latch.completed) {
    onMaintain?.();
    return true;
  }

  if (getScrollProgress(self) >= 1) {
    latch.completed = true;
    onLatch();
    return true;
  }

  return false;
}

type FadeSlideScrollOptions = {
  enter?: string;
  leave?: string;
  target?: Element | string;
};

/**
 * Scroll-synced fade + slide reveal that latches at completion.
 */
export function animateFadeSlideReveal(
  animateFn: typeof import("animejs").animate,
  onScrollFn: typeof import("animejs").onScroll,
  target: HTMLElement,
  scrollOptions: FadeSlideScrollOptions,
  runOnce = true,
) {
  const latch = runOnce ? createScrollRunOnceLatch() : null;
  let anim: ReturnType<typeof animateFn> | null = null;

  const applyFinal = () => {
    target.style.opacity = "1";
    target.style.transform = "translateY(0px)";
  };

  const onUpdate = (self: unknown) => {
    if (!latch) return;
    handleScrollRunOnceUpdate(
      latch,
      self,
      () => {
        anim?.revert();
        anim = null;
        applyFinal();
      },
      applyFinal,
    );
  };

  anim = animateFn(target, {
    opacity: [0, 1],
    translateY: ["40px", "0px"],
    autoplay: onScrollFn({
      enter: scrollOptions.enter ?? "bottom top",
      leave: scrollOptions.leave ?? "center center",
      target: scrollOptions.target,
      sync: true,
      onUpdate: latch ? onUpdate : undefined,
    }),
  });

  return anim;
}
