/**
 * Normalized bridge scroll progress p ∈ [0, 1] over the sticky track.
 * Single source of truth for hero fade, curtain close/open, and typing reveal.
 */

/** p1: hero fully faded + curtain fully closed (steps 2–4 complete). */
export const P_HERO_CURTAIN_CLOSE_END = 0.38;

/** Mobile: hero/logo fade completes earlier (less scroll distance). */
export const P_HERO_CURTAIN_CLOSE_END_MOBILE = 0.6;

const MOBILE_MQ = "(max-width: 768px)";

export function getHeroCurtainCloseEnd(isMobile = false): number {
  return isMobile ? P_HERO_CURTAIN_CLOSE_END_MOBILE : P_HERO_CURTAIN_CLOSE_END;
}

export function isMobileBridgeViewport(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia(MOBILE_MQ).matches;
}

/** p2: curtain fully open + typing should complete (step 5). */
export const P_CURTAIN_OPEN_END = 0.72;

/** p3: light hold; after this, user scroll reaches track end → About (step 6). */
export const P_BRIDGE_SETTLE_END = 0.92;
