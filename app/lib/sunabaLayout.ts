import {
  createSeededRandom,
  hashSeed,
  randomBetween,
  randomInt,
} from "./seededRandom";

export type PinnedTextPlacement = {
  id: string;
  text: string;
  left: number;
  top: number;
  rotate: number;
  fontSize: number;
  opacity: number;
};

const BG_SEED = "sunaba-bg";

export function buildPinnedTextPlacements(
  phrases: readonly string[],
  count = 32,
): PinnedTextPlacement[] {
  const rand = createSeededRandom(hashSeed(BG_SEED));
  const pool = [...phrases];
  const placements: PinnedTextPlacement[] = [];

  for (let i = 0; i < count; i += 1) {
    const idx = randomInt(rand, 0, pool.length - 1);
    const text = pool[idx] ?? "sunaba";
    placements.push({
      id: `pinned-${i}`,
      text,
      left: randomBetween(rand, 2, 92),
      top: randomBetween(rand, 2, 92),
      rotate: randomBetween(rand, -28, 28),
      fontSize: randomBetween(rand, 0.72, 1.45),
      opacity: randomBetween(rand, 0.12, 0.32),
    });
  }

  return placements;
}
