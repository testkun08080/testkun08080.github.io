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
  animeGreetingWord: "--color-anime-greeting-word",
  animeGreetingUnderline: "--color-anime-greeting-underline",
  animeBarcode: "--color-anime-barcode",
  animeSideText: "--color-anime-side-text",
  animeSideCaret: "--color-anime-side-caret",
  animeAboutText: "--color-anime-about-text",
} as const;

const STORAGE_KEY = "dev-integrated-theme-controls-v1";

type ThemeControls = {
  heading: string;
  subtitle: string;
  body: string;
  muted: string;
  inverse: string;
  borderSubtle: string;
  borderStrong: string;
  surfaceCard: string;
  surfaceCardStrong: string;
  collapseBlurPx: number;
  animeBgRow: string;
  animeFrontWord: string;
  animeUnderline: string;
  animeGreetingWord: string;
  animeGreetingUnderline: string;
  animeBarcode: string;
  animeSideText: string;
  animeSideCaret: string;
  animeAboutText: string;
};

const DEFAULT_CONTROLS: ThemeControls = {
  heading: "#0f172a",
  subtitle: "#64748b",
  body: "#334155",
  muted: "#475569",
  inverse: "#f8fafc",
  borderSubtle: "rgb(148 163 184 / 0.32)",
  borderStrong: "rgb(148 163 184 / 0.46)",
  surfaceCard: "rgb(255 255 255 / 0.7)",
  surfaceCardStrong: "rgb(255 255 255 / 0.84)",
  collapseBlurPx: 7,
  animeBgRow: "rgb(248 250 252 / 70%)",
  animeFrontWord: "#0f172a",
  animeUnderline: "#0b0b0b",
  animeGreetingWord: "#0f172a",
  animeGreetingUnderline: "#0b0b0b",
  animeBarcode: "#7f1d1d",
  animeSideText: "#ffffff",
  animeSideCaret: "rgb(255 255 255 / 0.9)",
  animeAboutText: "#111827",
};

function readSavedControls(): Partial<ThemeControls> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return {};
    return parsed as Partial<ThemeControls>;
  } catch {
    return {};
  }
}

export function FloatingThemeControls() {
  const [mounted, setMounted] = useState(false);
  const initialControls = { ...DEFAULT_CONTROLS, ...readSavedControls() };

  useEffect(() => setMounted(true), []);

  const controls = useControls("Design Tokens", {
    Text: folder({
      heading: { value: initialControls.heading },
      subtitle: { value: initialControls.subtitle },
      body: { value: initialControls.body },
      muted: { value: initialControls.muted },
      inverse: { value: initialControls.inverse },
    }),
    Surface: folder({
      borderSubtle: { value: initialControls.borderSubtle },
      borderStrong: { value: initialControls.borderStrong },
      surfaceCard: { value: initialControls.surfaceCard },
      surfaceCardStrong: { value: initialControls.surfaceCardStrong },
    }),
    Effects: folder({
      collapseBlurPx: { value: initialControls.collapseBlurPx, min: 0, max: 20, step: 1 },
    }),
    AnimeText: folder({
      animeBgRow: { value: initialControls.animeBgRow },
      animeFrontWord: { value: initialControls.animeFrontWord },
      animeUnderline: { value: initialControls.animeUnderline },
      animeGreetingWord: { value: initialControls.animeGreetingWord },
      animeGreetingUnderline: { value: initialControls.animeGreetingUnderline },
      animeBarcode: { value: initialControls.animeBarcode },
      animeSideText: { value: initialControls.animeSideText },
      animeSideCaret: { value: initialControls.animeSideCaret },
      animeAboutText: { value: initialControls.animeAboutText },
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
    root.style.setProperty(ROOT_VAR_MAP.animeGreetingWord, controls.animeGreetingWord);
    root.style.setProperty(ROOT_VAR_MAP.animeGreetingUnderline, controls.animeGreetingUnderline);
    root.style.setProperty(ROOT_VAR_MAP.animeBarcode, controls.animeBarcode);
    root.style.setProperty(ROOT_VAR_MAP.animeSideText, controls.animeSideText);
    root.style.setProperty(ROOT_VAR_MAP.animeSideCaret, controls.animeSideCaret);
    root.style.setProperty(ROOT_VAR_MAP.animeAboutText, controls.animeAboutText);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(controls));
    }
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
