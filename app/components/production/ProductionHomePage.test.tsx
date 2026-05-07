import { fireEvent, render, screen } from "@testing-library/react";
import type React from "react";
import { describe, expect, it, vi } from "vitest";
import { ProductionHomePage } from "./ProductionHomePage";
import { LanguageProvider } from "../../lib/LanguageContext";

vi.mock("../dev-integrated/ContactCardSection", () => ({
  ContactCardSection: () => <div>ContactCardSection</div>,
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
// Removed mock to test language functionality with real StickyQuickMenu

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

describe("ProductionHomePage language flow", () => {
  it("updates and restores document lang", () => {
    mockMatchMedia();
    document.documentElement.lang = "ja";

    const { unmount } = render(
      <LanguageProvider>
        <ProductionHomePage />
      </LanguageProvider>,
    );
    expect(document.documentElement.lang).toBe("en");

    const menuButton = screen.getByRole("button", { name: "Menu" });
    fireEvent.click(menuButton);

    fireEvent.click(
      screen.getAllByRole("button", {
        name: "Switch language between Japanese and English",
      })[0],
    );
    expect(document.documentElement.lang).toBe("ja");

    unmount();
    expect(document.documentElement.lang).toBe("ja");
  });
});
