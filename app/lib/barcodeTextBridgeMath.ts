/** ストライプが閉じる／開く波の幅（0〜1 の位相内） */
export const BRIDGE_WAVE = 0.1;

export function clamp01(v: number) {
  return Math.min(1, Math.max(0, v));
}

export function easeOutCubic(t: number) {
  return 1 - (1 - t) ** 3;
}

/** 閉じる位相 t ∈ [0,1] — 上の行から順に中央へ */
export function rowCloseLocal(t: number, index: number, n: number) {
  if (n <= 1) return clamp01(t);
  const start = (index / (n - 1)) * (1 - BRIDGE_WAVE);
  return clamp01((t - start) / BRIDGE_WAVE);
}

/** 開く位相 t ∈ [0,1] — 閉じた逆順（下の行から開く） */
export function rowOpenLocal(t: number, index: number, n: number) {
  if (n <= 1) return clamp01(t);
  const reverseIndex = n - 1 - index;
  const start = (reverseIndex / (n - 1)) * (1 - BRIDGE_WAVE);
  return clamp01((t - start) / BRIDGE_WAVE);
}
