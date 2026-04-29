import { useReducedMotion } from "motion/react";
import { Leva, folder, useControls } from "leva";
import { useEffect, useState } from "react";
import { HeroLogoInkWebGL, FlowMode } from "../../components/portfolio/HeroLogoInkWebGL";
import styles from "./DevLogoWebglInk.module.css";

export default function Page() {
  const reduceMotion = useReducedMotion() ?? false;
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const controls = useControls("Logo Ink", {
    Background: folder({
      bgColor: { value: "#f4ecdb" },
    }),
    Logo: folder({
      logoUrl: {
        value: "/logo-trans.svg",
        options: ["/logo-trans.svg", "/logo.svg"],
      },
      logoSize: { value: 0.32, min: 0.05, max: 1.0, step: 0.005 },
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
      inkOpacity: { value: 0.95, min: 0, max: 1, step: 0.01 },
    }),
    UVDistort: folder({
      uvDistortScale: { value: 2.5, min: 0.2, max: 10, step: 0.05 },
      uvDistortAmount: { value: 0.04, min: 0, max: 0.5, step: 0.005 },
      uvDistortSpeed: { value: 0.05, min: 0, max: 0.5, step: 0.005 },
    }),
    Flow: folder({
      flowMode: {
        value: "radial" as FlowMode,
        options: { directional: "directional", radial: "radial" },
      },
      flowAngle: { value: 90, min: 0, max: 360, step: 1 },
      flowStrength: { value: 1.0, min: 0, max: 5, step: 0.01 },
      flowRadius: { value: 1.2, min: 0.1, max: 3.0, step: 0.01 },
      flowFalloff: { value: 1.0, min: 0.2, max: 4.0, step: 0.01 },
      flowInvert: { value: false },
    }),
    Mouse: folder({
      mouseEnabled: { value: true },
      mouseStrength: { value: 0.06, min: 0, max: 0.3, step: 0.001 },
      mouseRadius: { value: 0.4, min: 0.05, max: 2.0, step: 0.01 },
    }),
    EdgeBand: folder({
      blurRadius: { value: 0.04, min: 0, max: 0.2, step: 0.001 },
      edgeWidth: { value: 0.6, min: 0.01, max: 1.5, step: 0.01 },
      edgeStrength: { value: 1.6, min: 0, max: 4, step: 0.01 },
      edgeColor: { value: "#1a1714" },
      edgeInkMix: { value: 0.7, min: 0, max: 1, step: 0.01 },
    }),
  });

  return (
    <main className={styles.page}>
      {mounted ? <Leva collapsed oneLineLabels /> : null}

      <HeroLogoInkWebGL
        className={styles.bgCanvas}
        paused={reduceMotion}
        {...controls}
        flowMode={controls.flowMode as FlowMode}
      />

      <div className={styles.caption}>dev-logo-webgl-ink</div>
    </main>
  );
}
