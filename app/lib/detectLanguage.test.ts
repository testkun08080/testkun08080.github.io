import { afterEach, describe, expect, it, vi } from "vitest";
import { detectBrowserLanguage } from "./detectLanguage";

function mockNavigator(languages: string[], language = languages[0] ?? "en") {
  vi.stubGlobal("navigator", {
    languages,
    language,
  });
}

describe("detectBrowserLanguage", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns ja for Japanese browser languages", () => {
    mockNavigator(["ja-JP", "en-US"], "ja-JP");
    expect(detectBrowserLanguage()).toBe("ja");

    mockNavigator(["ja"], "ja");
    expect(detectBrowserLanguage()).toBe("ja");
  });

  it("returns en for non-Japanese browser languages", () => {
    mockNavigator(["en-US"], "en-US");
    expect(detectBrowserLanguage()).toBe("en");

    mockNavigator(["fr-FR"], "fr-FR");
    expect(detectBrowserLanguage()).toBe("en");
  });

  it("falls back to navigator.language when languages is empty", () => {
    mockNavigator([], "ja-JP");
    expect(detectBrowserLanguage()).toBe("ja");
  });
});
