import { describe, expect, it } from "vitest";
import { createSeededRandom, hashSeed, randomBetween } from "./seededRandom";

describe("seededRandom", () => {
  it("returns the same sequence for the same seed", () => {
    const a = createSeededRandom(42);
    const b = createSeededRandom(42);
    const seqA = Array.from({ length: 5 }, () => a());
    const seqB = Array.from({ length: 5 }, () => b());
    expect(seqA).toEqual(seqB);
  });

  it("returns different sequences for different seeds", () => {
    const a = createSeededRandom(1);
    const b = createSeededRandom(2);
    expect(a()).not.toBe(b());
  });

  it("hashSeed is stable for the same string", () => {
    expect(hashSeed("sunaba-bg")).toBe(hashSeed("sunaba-bg"));
    expect(hashSeed("sunaba-board")).not.toBe(hashSeed("sunaba-bg"));
  });

  it("randomBetween stays within bounds", () => {
    const rand = createSeededRandom(99);
    for (let i = 0; i < 20; i += 1) {
      const v = randomBetween(rand, 2, 92);
      expect(v).toBeGreaterThanOrEqual(2);
      expect(v).toBeLessThanOrEqual(92);
    }
  });
});
