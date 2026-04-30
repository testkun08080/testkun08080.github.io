import { Leva, folder, useControls } from "leva";
import { useEffect, useState } from "react";

const ROOT_VAR_MAP = {
  heading: "--color-text-heading",
  subtitle: "--color-text-subtitle",
  body: "--color-text-body",
  muted: "--color-text-muted",
  inverse: "--color-text-inverse",
  borderSubtle: "--color-border-subtle",
  borderStrong: "--color-border-strong",
  surfaceCard: "--surface-card",
  surfaceCardStrong: "--surface-card-strong",
  collapseBlurPx: "--fx-collapse-blur",
  animeBgRow: "--color-anime-bg-row",
  animeFrontWord: "--color-anime-front-word",
  animeUnderline: "--color-anime-underline",
  animeBarcode: "--color-anime-barcode",
  animeSideText: "--color-anime-side-text",
  animeSideCaret: "--color-anime-side-caret",
  animeAboutText: "--color-anime-about-text",
} as const;

export function FloatingThemeControls() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const controls = useControls("Design Tokens", {
    Text: folder({
      heading: { value: "#0f172a" },
      subtitle: { value: "#64748b" },
      body: { value: "#334155" },
      muted: { value: "#475569" },
      inverse: { value: "#f8fafc" },
    }),
    Surface: folder({
      borderSubtle: { value: "rgb(148 163 184 / 0.32)" },
      borderStrong: { value: "rgb(148 163 184 / 0.46)" },
      surfaceCard: { value: "rgb(255 255 255 / 0.7)" },
      surfaceCardStrong: { value: "rgb(255 255 255 / 0.84)" },
    }),
    Effects: folder({
      collapseBlurPx: { value: 7, min: 0, max: 20, step: 1 },
    }),
    AnimeText: folder({
      animeBgRow: { value: "rgb(248 250 252 / 70%)" },
      animeFrontWord: { value: "#0f172a" },
      animeUnderline: { value: "#0b0b0b" },
      animeBarcode: { value: "#7f1d1d" },
      animeSideText: { value: "#ffffff" },
      animeSideCaret: { value: "rgb(255 255 255 / 0.9)" },
      animeAboutText: { value: "#111827" },
    }),
  });

  useEffect(() => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    root.style.setProperty(ROOT_VAR_MAP.heading, controls.heading);
    root.style.setProperty(ROOT_VAR_MAP.subtitle, controls.subtitle);
    root.style.setProperty(ROOT_VAR_MAP.body, controls.body);
    root.style.setProperty(ROOT_VAR_MAP.muted, controls.muted);
    root.style.setProperty(ROOT_VAR_MAP.inverse, controls.inverse);
    root.style.setProperty(ROOT_VAR_MAP.borderSubtle, controls.borderSubtle);
    root.style.setProperty(ROOT_VAR_MAP.borderStrong, controls.borderStrong);
    root.style.setProperty(ROOT_VAR_MAP.surfaceCard, controls.surfaceCard);
    root.style.setProperty(ROOT_VAR_MAP.surfaceCardStrong, controls.surfaceCardStrong);
    root.style.setProperty(ROOT_VAR_MAP.collapseBlurPx, `${controls.collapseBlurPx}px`);
    root.style.setProperty(ROOT_VAR_MAP.animeBgRow, controls.animeBgRow);
    root.style.setProperty(ROOT_VAR_MAP.animeFrontWord, controls.animeFrontWord);
    root.style.setProperty(ROOT_VAR_MAP.animeUnderline, controls.animeUnderline);
    root.style.setProperty(ROOT_VAR_MAP.animeBarcode, controls.animeBarcode);
    root.style.setProperty(ROOT_VAR_MAP.animeSideText, controls.animeSideText);
    root.style.setProperty(ROOT_VAR_MAP.animeSideCaret, controls.animeSideCaret);
    root.style.setProperty(ROOT_VAR_MAP.animeAboutText, controls.animeAboutText);
  }, [controls]);

  if (!mounted) return null;
  return (
    <div
      style={{
        position: "fixed",
        top: "0.75rem",
        right: "0.75rem",
        zIndex: 120,
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          width: "min(360px, calc(100vw - 1.5rem))",
          pointerEvents: "auto",
        }}
      >
        <Leva fill collapsed oneLineLabels />
      </div>
    </div>
  );
}
