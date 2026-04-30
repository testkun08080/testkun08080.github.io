import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ProductionHomePage } from "./ProductionHomePage";

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
  SideCenterStickySection: () => <div>SideCenterStickySection</div>,
}));
vi.mock("../dev-integrated/SkillsToolsSection", () => ({
  SkillsToolsSection: () => <div>SkillsToolsSection</div>,
}));
vi.mock("../dev-integrated/WorkReelsSection", () => ({
  WorkReelsSection: () => <div>WorkReelsSection</div>,
}));
vi.mock("../portfolio/StickyQuickMenu", () => ({
  StickyQuickMenu: () => <div>StickyQuickMenu</div>,
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

describe("ProductionHomePage language flow", () => {
  it("updates and restores document lang", () => {
    mockMatchMedia();
    document.documentElement.lang = "ja";

    const { unmount } = render(<ProductionHomePage />);
    expect(document.documentElement.lang).toBe("ja");

    fireEvent.click(
      screen.getByRole("button", {
        name: "日本語と英語を切り替える",
      }),
    );
    expect(document.documentElement.lang).toBe("en");

    unmount();
    expect(document.documentElement.lang).toBe("ja");
  });
});
