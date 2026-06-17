import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import type React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ProductionHomePage } from "./ProductionHomePage";
import { LanguageProvider, useLanguage } from "../../lib/LanguageContext";
import { productionHomeCopy } from "../../lib/translations";

vi.mock("../dev-integrated/ContactCardSection", () => ({
  ContactCardSection: () => <div>ContactCardSection</div>,
}));
vi.mock("../dev-integrated/OthersCardSection", () => ({
  OthersCardSection: () => <div>OthersCardSection</div>,
}));
vi.mock("../dev-integrated/GreetingBurstSection", () => ({
  GreetingBurstSection: () => <div>GreetingBurstSection</div>,
}));
vi.mock("../dev-integrated/HeroBurstLogoSection", () => ({
  HeroBurstLogoSection: () => <div>HeroBurstLogoSection</div>,
}));
vi.mock("../dev-integrated/ScrollTypingHeading", () => ({
  ScrollTypingHeading: ({ text }: { text: string }) => <h2>{text}</h2>,
}));
vi.mock("../dev-integrated/SideCenterStickySection", () => ({
  SideCenterStickySection: ({ children }: { children?: React.ReactNode }) => (
    <div>SideCenterStickySection{children}</div>
  ),
}));
vi.mock("../dev-integrated/SkillsToolsSection", () => ({
  SkillsToolsSection: () => <div>SkillsToolsSection</div>,
}));
vi.mock("../dev-integrated/WorkReelsSection", () => ({
  WorkReelsSection: () => <div>WorkReelsSection</div>,
}));
vi.mock("./ProductionResumeDownload", () => ({
  ProductionResumeDownload: () => <div>ProductionResumeDownload</div>,
}));
vi.mock("./LoadingScreen", () => ({
  LoadingScreen: () => null,
}));

function mockMatchMedia() {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation(() => ({
      matches: false,
      media: "(prefers-reduced-motion: reduce)",
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
}

function mockNavigator(languages: string[], language = languages[0] ?? "en") {
  vi.stubGlobal("navigator", {
    languages,
    language,
  });
}

describe("ProductionHomePage language flow", () => {
  beforeEach(() => {
    window.localStorage.clear();
    mockMatchMedia();
    mockNavigator(["en-US"], "en-US");
    document.documentElement.lang = "ja";
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("starts in English when the browser language is English", () => {
    const { unmount } = render(
      <LanguageProvider>
        <ProductionHomePage />
      </LanguageProvider>,
    );
    expect(document.documentElement.lang).toBe("en");

    unmount();
    expect(document.documentElement.lang).toBe("ja");
  });

  it("defaults to English before applying a Japanese browser language", async () => {
    mockNavigator(["ja-JP"], "ja-JP");
    let initialLanguage: string | null = null;

    function LanguageProbe() {
      const { language } = useLanguage();
      if (initialLanguage === null) {
        initialLanguage = language;
      }
      return null;
    }

    const { unmount: unmountProbe } = render(
      <LanguageProvider>
        <LanguageProbe />
      </LanguageProvider>,
    );
    expect(initialLanguage).toBe("en");
    unmountProbe();

    const { unmount } = render(
      <LanguageProvider>
        <ProductionHomePage />
      </LanguageProvider>,
    );

    await waitFor(() => {
      expect(document.documentElement.lang).toBe("ja");
    });

    unmount();
  });

  it("restores a saved language preference without waiting for detection", () => {
    window.localStorage.setItem("site-language", "ja");
    mockNavigator(["en-US"], "en-US");

    const { unmount } = render(
      <LanguageProvider>
        <ProductionHomePage />
      </LanguageProvider>,
    );
    expect(document.documentElement.lang).toBe("ja");

    unmount();
  });

  it("persists manual language selection in localStorage", () => {
    const { unmount } = render(
      <LanguageProvider>
        <ProductionHomePage />
      </LanguageProvider>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Menu" }));
    fireEvent.click(
      screen.getAllByRole("button", {
        name: "Switch language between Japanese and English",
      })[0],
    );

    expect(document.documentElement.lang).toBe("ja");
    expect(window.localStorage.getItem("site-language")).toBe("ja");

    unmount();
  });

  it("keeps Others copy in English when the page is Japanese", () => {
    expect(productionHomeCopy.ja.othersHeading).toBe("Others");
    expect(productionHomeCopy.ja.blogLinkLabel).toBe("Blog");
    expect(
      productionHomeCopy.ja.menuItems.find((item) => item.href === "#others")
        ?.label,
    ).toBe("others");
  });
});
