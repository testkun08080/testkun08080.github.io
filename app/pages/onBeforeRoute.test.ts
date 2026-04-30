import { describe, expect, it } from "vitest";
import { isBlockedDevRoute } from "../lib/routeGuards";

describe("isBlockedDevRoute", () => {
  it("blocks dev routes", () => {
    expect(isBlockedDevRoute("/dev")).toBe(true);
    expect(isBlockedDevRoute("/dev-integrated")).toBe(true);
    expect(isBlockedDevRoute("/dev-anything")).toBe(true);
  });

  it("allows public routes", () => {
    expect(isBlockedDevRoute("/")).toBe(false);
    expect(isBlockedDevRoute("/portfolio")).toBe(false);
  });
});
