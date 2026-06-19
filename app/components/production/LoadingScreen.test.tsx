import { fireEvent, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { LoadingScreen } from "./LoadingScreen";

describe("LoadingScreen scroll lock", () => {
  beforeEach(() => {
    document.documentElement.style.overflow = "";
    document.documentElement.style.overscrollBehavior = "";
    document.body.style.overflow = "";
    document.body.style.overscrollBehavior = "";
    document.body.style.position = "";
    document.body.style.top = "";
    document.body.style.left = "";
    document.body.style.right = "";
    document.body.style.width = "";
    vi.spyOn(window, "scrollTo").mockImplementation(() => {});
  });

  afterEach(() => {
    document.documentElement.style.overflow = "";
    document.documentElement.style.overscrollBehavior = "";
    document.body.style.overflow = "";
    document.body.style.overscrollBehavior = "";
    document.body.style.position = "";
    document.body.style.top = "";
    document.body.style.left = "";
    document.body.style.right = "";
    document.body.style.width = "";
    vi.restoreAllMocks();
  });

  it("locks html and body overflow while visible", () => {
    render(<LoadingScreen visible />);

    expect(document.documentElement.style.overflow).toBe("hidden");
    expect(document.body.style.overflow).toBe("hidden");
    expect(document.body.style.position).toBe("fixed");
    expect(document.body.style.top).toBe("0px");
  });

  it("prevents wheel scrolling while locked", () => {
    render(<LoadingScreen visible />);

    const wheelEvent = new WheelEvent("wheel", {
      deltaY: 120,
      bubbles: true,
      cancelable: true,
    });
    const prevented = !window.dispatchEvent(wheelEvent);

    expect(prevented).toBe(true);
    expect(window.scrollTo).not.toHaveBeenCalled();
  });

  it("restores overflow and resets scroll after fade-out completes", () => {
    document.body.style.overflow = "auto";
    document.body.style.position = "static";

    const { container, rerender } = render(<LoadingScreen visible />);
    const overlay = container.firstElementChild as HTMLDivElement;

    rerender(<LoadingScreen visible={false} />);
    fireEvent.transitionEnd(overlay, { propertyName: "opacity" });

    expect(document.body.style.overflow).toBe("auto");
    expect(document.body.style.position).toBe("static");
    expect(document.documentElement.style.overflow).toBe("");
    expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
  });
});
