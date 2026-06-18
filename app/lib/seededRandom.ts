/** Mulberry32 — deterministic PRNG from a numeric seed. */
export function createSeededRandom(seed: number) {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function hashSeed(input: string): number {
  let hash = 0;
  for (let i = 0; i < input.length; i += 1) {
    hash = (Math.imul(31, hash) + input.charCodeAt(i)) | 0;
  }
  return hash >>> 0;
}

export function randomBetween(rand: () => number, min: number, max: number) {
  return min + rand() * (max - min);
}

export function randomInt(rand: () => number, min: number, max: number) {
  return Math.floor(randomBetween(rand, min, max + 1));
}
