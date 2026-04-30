import { useEffect, useState } from "react";
import { Leva, folder, useControls } from "leva";
import {
  FlowMode,
  HeroLogoInkWebGL,
} from "../../components/portfolio/HeroLogoInkWebGL";
import { PathBarcodeTemplate3D } from "../../components/portfolio/PathBarcodeTemplate3D";
import styles from "./DevBurstOverlayAnimeLogo.module.css";

const HERO_BARCODE = {
  fontSize: {
    min: "0.5rem",
    preferred: "1.5vw",
    max: "1.23rem",
  },
  letterSpacing: "0.02em",
  fill: "#7f1d1d",
} as const;

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !("matchMedia" in window)) return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  return reduced;
}

export default function Page() {
  const reduceMotion = usePrefersReducedMotion();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const fs = HERO_BARCODE.fontSize;
  const controls = useControls("Logo Ink", {
    Background: folder({
      bgColor: { value: "#f7efe4" },
    }),
    Logo: folder({
      logoUrl: {
        value: "/logo-trans.svg",
        options: ["/logo-trans.svg", "/logo.svg"],
      },
      logoSize: { value: 0.33, min: 0.05, max: 1.0, step: 0.005 },
      centerX: { value: 0.0, min: -1.5, max: 1.5, step: 0.01 },
      centerY: { value: 0.0, min: -1.5, max: 1.5, step: 0.01 },
    }),
    Instances: folder({
      instanceCount: { value: 1, min: 1, max: 12, step: 1 },
      instanceRadius: { value: 0.5, min: 0, max: 2, step: 0.01 },
      instanceAngleOffset: { value: 0, min: 0, max: 360, step: 1 },
      instanceRotation: { value: 0, min: -360, max: 360, step: 1 },
    }),
    InkInside: folder({
      inkScale: { value: 4.0, min: 0.5, max: 12, step: 0.05 },
      warpScale: { value: 2.0, min: 0.2, max: 6, step: 0.05 },
      warpAmount: { value: 0.6, min: 0, max: 2, step: 0.01 },
      warpSpeed: { value: 0.05, min: 0, max: 0.5, step: 0.005 },
      inkLight: { value: "#cbbfa8" },
      inkDark: { value: "#1a1714" },
      inkContrast: { value: 1.4, min: 0.2, max: 4, step: 0.01 },
      inkOpacity: { value: 0.9, min: 0, max: 1, step: 0.01 },
    }),
    UVDistort: folder({
      uvDistortScale: { value: 2.5, min: 0.2, max: 10, step: 0.05 },
      uvDistortAmount: { value: 0.035, min: 0, max: 0.5, step: 0.005 },
      uvDistortSpeed: { value: 0.05, min: 0, max: 0.5, step: 0.005 },
    }),
    Flow: folder({
      flowMode: {
        value: "radial" as FlowMode,
        options: { directional: "directional", radial: "radial" },
      },
      flowAngle: { value: 90, min: 0, max: 360, step: 1 },
      flowStrength: { value: 1.1, min: 0, max: 5, step: 0.01 },
      flowRadius: { value: 1.2, min: 0.1, max: 3.0, step: 0.01 },
      flowFalloff: { value: 1.0, min: 0.2, max: 4.0, step: 0.01 },
      flowInvert: { value: false },
    }),
    Mouse: folder({
      mouseEnabled: { value: !reduceMotion },
      mouseStrength: { value: 0.045, min: 0, max: 0.3, step: 0.001 },
      mouseRadius: { value: 0.45, min: 0.05, max: 2.0, step: 0.01 },
    }),
    EdgeBand: folder({
      blurRadius: { value: 0.028, min: 0, max: 0.2, step: 0.001 },
      edgeWidth: { value: 0.6, min: 0.01, max: 1.5, step: 0.01 },
      edgeStrength: { value: 1.3, min: 0, max: 4, step: 0.01 },
      edgeColor: { value: "#1a1714" },
      edgeInkMix: { value: 0.7, min: 0, max: 1, step: 0.01 },
    }),
  });

  return (
    <main className={styles.page}>
      {mounted ? <Leva collapsed oneLineLabels /> : null}

      <section className={styles.intro}>
        <h1 className={styles.title}>dev-burst-overlay-anime-logo</h1>
        <p className={styles.copy}>
          ロゴ + ヒーロー枠バーコードの合成テスト。
          スクロール連動なし。
        </p>
      </section>

      <section className={styles.stage}>
        <HeroLogoInkWebGL
          className={styles.logoLayer}
          paused={reduceMotion}
          {...controls}
          flowMode={controls.flowMode as FlowMode}
          mouseEnabled={reduceMotion ? false : controls.mouseEnabled}
        />

        <div className={styles.barcodeFrame}>
          <PathBarcodeTemplate3D
            paused={reduceMotion}
            className={styles.barcodeTheme}
            flowDurationMs={33000}
            textUnit="*0123456789ABCDEF* "
            textRepeat={11}
            pathD="
              M 8 2
              H 92
              Q 98 2 98 8
              V 92
              Q 98 98 92 98
              H 8
              Q 2 98 2 92
              V 8
              Q 2 2 8 2
              Z
            "
          />
        </div>
      </section>

      <style>{`
        .${styles.barcodeTheme} {
          font-family: "Libre Barcode 39", ui-monospace, monospace;
          font-size: clamp(${fs.min}, ${fs.preferred}, ${fs.max});
          line-height: 1;
          letter-spacing: ${HERO_BARCODE.letterSpacing};
          fill: ${HERO_BARCODE.fill};
        }
      `}</style>
    </main>
  );
}
