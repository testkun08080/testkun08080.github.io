import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { StickyQuickMenu } from "./StickyQuickMenu";

vi.mock("animejs", () => ({
  animate: () => ({ revert: vi.fn() }),
  stagger: (value: number) => value,
}));

function mockMatchMedia(matches: boolean, query?: string) {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation((q: string) => ({
      matches: query ? q === query : matches,
      media: query || "(prefers-reduced-motion: reduce)",
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
}

describe("StickyQuickMenu", () => {
  it("keeps aria state in sync in reduced-motion mode", async () => {
    mockMatchMedia(true);

    render(
      <StickyQuickMenu
        items={[{ href: "#hero", label: "Top" }]}
        onToggleLanguage={() => {}}
      />,
    );

    const menu = await screen.findByRole("navigation");
    const panel = menu.querySelector("div[id]");
    expect(panel).toBeTruthy();

    await waitFor(() => {
      expect(panel).toHaveAttribute("aria-hidden", "false");
    });
  });

  it("opens and closes menu from button", () => {
    mockMatchMedia(false);

    render(<StickyQuickMenu items={[{ href: "#hero", label: "Top" }]} />);
    const button = screen.getByRole("button", { name: "Menu" });
    const panel = document.getElementById(button.getAttribute("aria-controls") || "");
    expect(panel).toHaveAttribute("aria-hidden", "true");

    fireEvent.click(button);
    expect(panel).toHaveAttribute("aria-hidden", "false");
  });

  it("renders menu items with icon support", () => {
    mockMatchMedia(false);

    render(
      <StickyQuickMenu
        items={[
          { href: "#hero", label: "TOP", iconKey: "home" },
          { href: "#about", label: "About", iconKey: "info" },
        ]}
      />,
    );
    const button = screen.getByRole("button", { name: "Menu" });
    fireEvent.click(button);

    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(2);
    expect(links[0]).toHaveAttribute("data-label", "TOP");
    expect(links[1]).toHaveAttribute("data-label", "About");
  });
});
