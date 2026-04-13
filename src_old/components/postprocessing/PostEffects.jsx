import React from "react";
import {
  Autofocus,
  Bloom,
  DepthOfField,
  EffectComposer,
  Noise,
  Vignette,
  ChromaticAberration,
  ColorAverage,
  Glitch,
  GodRays,
  LensFlare,
  Pixelation,
  N8AO,
  Scanline,
  SelectiveBloom,
  Sepia,
  SSAO,
  ToneMapping,
  HueSaturation,
  BrightnessContrast,
  ColorDepth,
  DotScreen,
  Grid,
  Outline,
  SMAA,
} from "@react-three/postprocessing";
import { useControls } from "leva";
import { BlendFunction } from "postprocessing";
import {
  WaveEffect,
  RGBSplitEffect,
  KaleidoscopeEffect,
  ColorShiftEffect,
  FractalNoiseEffect,
  EdgeOutlineEffect,
  ViewDepthVisualization,
  SimpleWorldNormalEffect,
} from "./CustomShaders";

const PostEffects = () => {
  // Global Effect Controls
  const globalControls = useControls("Global Settings", {
    enabled: true,
  });

  const dofControls = useControls("Depth of Field", {
    enabled: false,
    intensity: { value: 1.0, min: 0, max: 2, step: 0.01 },
    focusDistance: { value: 0, min: 0, max: 1, step: 0.01 },
    focalLength: { value: 0.02, min: 0, max: 0.1, step: 0.001 },
    bokehScale: { value: 2, min: 0, max: 10, step: 0.1 },
    height: { value: 480, min: 100, max: 1000, step: 10 },
  });

  const bloomControls = useControls("Bloom", {
    enabled: true,
    intensity: { value: 1.0, min: 0, max: 3, step: 0.01 },
    luminanceThreshold: { value: 0, min: 0, max: 2, step: 0.01 },
    luminanceSmoothing: { value: 0.9, min: 0, max: 1, step: 0.01 },
    height: { value: 300, min: 100, max: 1000, step: 10 },
  });

  const noiseControls = useControls("Noise", {
    enabled: true,
    opacity: { value: 0.02, min: 0, max: 1, step: 0.001 },
  });

  const vignetteControls = useControls("Vignette", {
    enabled: true,
    intensity: { value: 1.0, min: 0, max: 2, step: 0.01 },
    eskil: false,
    offset: { value: 0.1, min: 0, max: 1, step: 0.01 },
    darkness: { value: 1.1, min: 0, max: 2, step: 0.01 },
  });

  const chromaticControls = useControls("Chromatic Aberration", {
    enabled: false,
    intensity: { value: 1.0, min: 0, max: 2, step: 0.01 },
    radialModulation: true,
    modulationOffset: { value: 0.15, min: 0, max: 1, step: 0.01 },
  });

  const glitchControls = useControls("Glitch", {
    enabled: false,
    intensity: { value: 0.5, min: 0, max: 2, step: 0.01 },
    delay: { value: 1.5, min: 0, max: 5, step: 0.1 },
    duration: { value: 0.6, min: 0, max: 2, step: 0.1 },
    strength: { value: 0.3, min: 0, max: 1, step: 0.01 },
  });

  const pixelationControls = useControls("Pixelation", {
    enabled: false,
    intensity: { value: 1.0, min: 0, max: 2, step: 0.01 },
    granularity: { value: 30, min: 1, max: 100, step: 1 },
  });

  const scanlineControls = useControls("Scanline", {
    enabled: false,
    intensity: { value: 1.0, min: 0, max: 2, step: 0.01 },
    density: { value: 1.25, min: 0.1, max: 5, step: 0.01 },
  });

  const sepiaControls = useControls("Sepia", {
    enabled: false,
    intensity: { value: 1.0, min: 0, max: 2, step: 0.01 },
  });

  const ssaoControls = useControls("SSAO", {
    enabled: false,
    intensity: { value: 1.0, min: 0, max: 2, step: 0.01 },
    samples: { value: 30, min: 1, max: 32, step: 1 },
    rings: { value: 4, min: 1, max: 16, step: 1 },
    distanceThreshold: { value: 1.0, min: 0.1, max: 2, step: 0.01 },
    distanceFalloff: { value: 0.0, min: 0, max: 1, step: 0.01 },
    rangeThreshold: { value: 0.5, min: 0, max: 1, step: 0.01 },
    rangeFalloff: { value: 0.1, min: 0, max: 1, step: 0.01 },
    luminanceInfluence: { value: 0.7, min: 0, max: 1, step: 0.01 },
    radius: { value: 20, min: 0.1, max: 50, step: 0.1 },
    scale: { value: 0.5, min: 0.1, max: 2, step: 0.01 },
    bias: { value: 0.5, min: 0, max: 1, step: 0.01 },
  });

  const toneMappingControls = useControls("Tone Mapping", {
    enabled: false,
    adaptive: true,
    resolution: { value: 256, min: 64, max: 1024, step: 64 },
    middleGrey: { value: 0.6, min: 0, max: 1, step: 0.01 },
    maxLuminance: { value: 16, min: 1, max: 32, step: 0.5 },
    averageLuminance: { value: 1, min: 0.01, max: 2, step: 0.01 },
    adaptationRate: { value: 1, min: 0.1, max: 5, step: 0.1 },
  });

  const hueSaturationControls = useControls("Hue Saturation", {
    enabled: false,
    intensity: { value: 1.0, min: 0, max: 2, step: 0.01 },
    hue: { value: 0, min: -Math.PI, max: Math.PI, step: 0.01 },
    saturation: { value: 0, min: -1, max: 1, step: 0.01 },
  });

  const brightnessContrastControls = useControls("Brightness Contrast", {
    enabled: false,
    intensity: { value: 1.0, min: 0, max: 2, step: 0.01 },
    brightness: { value: 0, min: -1, max: 1, step: 0.01 },
    contrast: { value: 0, min: -1, max: 1, step: 0.01 },
  });

  const colorDepthControls = useControls("Color Depth", {
    enabled: false,
    intensity: { value: 1.0, min: 0, max: 2, step: 0.01 },
    bits: { value: 16, min: 1, max: 32, step: 1 },
  });

  const dotScreenControls = useControls("Dot Screen", {
    enabled: false,
    intensity: { value: 1.0, min: 0, max: 2, step: 0.01 },
    scale: { value: 1, min: 0.1, max: 2, step: 0.01 },
    angle: { value: 1.57, min: 0, max: Math.PI * 2, step: 0.01 },
  });

  const gridControls = useControls("Grid", {
    enabled: false,
    intensity: { value: 1.0, min: 0, max: 2, step: 0.01 },
    scale: { value: 1, min: 0.1, max: 2, step: 0.01 },
    lineWidth: { value: 0, min: 0, max: 0.1, step: 0.001 },
  });

  const autofocusControls = useControls("Autofocus", {
    enabled: false,
    intensity: { value: 1.0, min: 0, max: 2, step: 0.01 },
    target: { value: [0, 0, 0] },
    smoothTime: { value: 0.25, min: 0, max: 2, step: 0.01 },
  });

  const colorAverageControls = useControls("Color Average", {
    enabled: false,
    intensity: { value: 1.0, min: 0, max: 2, step: 0.01 },
  });

  // God Rays disabled due to lightSource dependency
  // const godRaysControls = useControls('God Rays (Disabled - Needs Lights)', {
  //   enabled: false,
  //   intensity: { value: 1.0, min: 0, max: 2, step: 0.01 },
  //   density: { value: 0.96, min: 0, max: 1, step: 0.01 },
  //   decay: { value: 0.9, min: 0, max: 1, step: 0.01 },
  //   weight: { value: 0.4, min: 0, max: 1, step: 0.01 },
  //   exposure: { value: 0.6, min: 0, max: 1, step: 0.01 },
  //   samples: { value: 60, min: 1, max: 100, step: 1 },
  //   clampMax: { value: 1, min: 0, max: 2, step: 0.01 }
  // });

  const lensFlareControls = useControls("Lens Flare", {
    enabled: false,
    intensity: { value: 1.0, min: 0, max: 2, step: 0.01 },
  });

  const n8aoControls = useControls("N8AO (Enhanced SSAO)", {
    enabled: false,
    intensity: { value: 4.0, min: 1, max: 10, step: 0.1 },
    aoRadius: { value: 1.0, min: 0.1, max: 5, step: 0.1 },
    distanceFalloff: { value: 1.0, min: 0.1, max: 5, step: 0.1 },
    quality: {
      value: "performance",
      options: ["performance", "low", "medium", "high", "ultra"],
    },
    halfRes: true,
    screenSpaceRadius: false,
  });

  // Selective Bloom disabled due to lights dependency
  // const selectiveBloomControls = useControls('Selective Bloom (Disabled - Needs Lights)', {
  //   enabled: false,
  //   intensity: { value: 1.0, min: 0, max: 2, step: 0.01 },
  //   luminanceThreshold: { value: 0.9, min: 0, max: 2, step: 0.01 },
  //   luminanceSmoothing: { value: 0.025, min: 0, max: 1, step: 0.001 },
  //   mipmapBlur: false,
  //   height: { value: 480, min: 100, max: 1000, step: 10 }
  // });

  const outlineControls = useControls("Outline", {
    enabled: false,
    intensity: { value: 1.0, min: 0, max: 2, step: 0.01 },
    thickness: { value: 0.005, min: 0, max: 0.1, step: 0.001 },
    color: "#ffffff",
  });

  // Custom Shader Controls
  const waveControls = useControls("Custom: Wave Distortion", {
    enabled: false,
    intensity: { value: 0.1, min: 0, max: 2, step: 0.01 },
    frequency: { value: 10.0, min: 1, max: 50, step: 0.1 },
    speed: { value: 1.0, min: 0, max: 5, step: 0.1 },
    amplitude: { value: 0.005, min: 0, max: 0.1, step: 0.001 },
  });

  const rgbSplitControls = useControls("Custom: RGB Split", {
    enabled: false,
    intensity: { value: 1.0, min: 0, max: 2, step: 0.01 },
    angle: { value: 0.0, min: 0, max: Math.PI * 2, step: 0.01 },
    amount: { value: 0.005, min: 0, max: 0.1, step: 0.001 },
  });

  const kaleidoscopeControls = useControls("Custom: Kaleidoscope", {
    enabled: false,
    intensity: { value: 1.0, min: 0, max: 2, step: 0.01 },
    segments: { value: 6.0, min: 2, max: 16, step: 1 },
    angle: { value: 0.0, min: 0, max: Math.PI * 2, step: 0.01 },
  });

  const colorShiftControls = useControls("Custom: Color Shift", {
    enabled: false,
    intensity: { value: 1.0, min: 0, max: 2, step: 0.01 },
    hueShift: { value: 0.0, min: -1, max: 1, step: 0.01 },
    saturation: { value: 1.0, min: 0, max: 2, step: 0.01 },
    brightness: { value: 1.0, min: 0, max: 2, step: 0.01 },
  });

  const fractalNoiseControls = useControls("Custom: Fractal Noise", {
    enabled: false,
    intensity: { value: 1.0, min: 0, max: 2, step: 0.01 },
    scale: { value: 10.0, min: 1, max: 50, step: 0.1 },
    octaves: { value: 4.0, min: 1, max: 8, step: 1 },
    lacunarity: { value: 2.0, min: 1, max: 4, step: 0.1 },
    gain: { value: 0.5, min: 0, max: 1, step: 0.01 },
  });

  const edgeOutlineControls = useControls("Custom: Edge Outline", {
    enabled: false,
    intensity: { value: 1.0, min: 0, max: 1, step: 0.01 },
    threshold: { value: 0.1, min: 0, max: 1, step: 0.01 },
    color: "#ffffff",
    depthSensitivity: { value: 1.0, min: 0, max: 5, step: 0.1 },
    normalSensitivity: { value: 1.0, min: 0, max: 5, step: 0.1 },
    thickness: { value: 1.0, min: 0.1, max: 3, step: 0.1 },
  });

  const viewDepthControls = useControls("Custom: View Depth Visualization", {
    enabled: false,
    intensity: { value: 1.0, min: 0, max: 1, step: 0.01 },
    depthMin: { value: 0.0, min: 0.0, max: 1.0, step: 0.01 },
    depthMax: { value: 1.0, min: 0.0, max: 1.0, step: 0.01 },
  });

  const simpleWorldNormalControls = useControls("Custom: Simple World Normal", {
    enabled: false,
    intensity: { value: 1.0, min: 0, max: 1, step: 0.01 },
    mode: {
      value: 0,
      options: {
        "RGB Colors": 0,
        Grayscale: 1,
        "X Component (Red)": 2,
        "Y Component (Green)": 3,
        "Z Component (Blue)": 4,
        "Heat Map": 5,
      },
    },
    useWorldSpace: true,
  });

  if (!globalControls.enabled) {
    return null;
  }

  return (
    <EffectComposer depthBuffer={true} enableNormalPass={true}>
      {/* <NormalPass /> */}
      {/* SMAA - Should be first for antialiasing
      <SMAA /> */}
      {/* Depth of Field */}
      {dofControls.enabled && (
        <DepthOfField
          focusDistance={dofControls.focusDistance}
          focalLength={dofControls.focalLength}
          bokehScale={dofControls.bokehScale}
          height={dofControls.height}
          blendFunction={BlendFunction.NORMAL}
          opacity={dofControls.intensity}
        />
      )}
      {/* SSAO - Ambient Occlusion */}
      {ssaoControls.enabled && (
        <SSAO
          samples={ssaoControls.samples}
          rings={ssaoControls.rings}
          distanceThreshold={ssaoControls.distanceThreshold}
          distanceFalloff={ssaoControls.distanceFalloff}
          rangeThreshold={ssaoControls.rangeThreshold}
          rangeFalloff={ssaoControls.rangeFalloff}
          luminanceInfluence={ssaoControls.luminanceInfluence}
          radius={ssaoControls.radius}
          scale={ssaoControls.scale}
          bias={ssaoControls.bias}
          blendFunction={BlendFunction.MULTIPLY}
          opacity={ssaoControls.intensity}
        />
      )}
      {/* Bloom */}
      {bloomControls.enabled && (
        <Bloom
          luminanceThreshold={bloomControls.luminanceThreshold}
          luminanceSmoothing={bloomControls.luminanceSmoothing}
          height={bloomControls.height}
          blendFunction={BlendFunction.SCREEN}
          opacity={bloomControls.intensity}
        />
      )}
      {/* Chromatic Aberration */}
      {chromaticControls.enabled && (
        <ChromaticAberration
          radialModulation={chromaticControls.radialModulation}
          modulationOffset={chromaticControls.modulationOffset}
          blendFunction={BlendFunction.NORMAL}
          opacity={chromaticControls.intensity}
        />
      )}
      {/* Glitch */}
      {glitchControls.enabled && (
        <Glitch
          delay={[
            glitchControls.delay,
            glitchControls.delay + glitchControls.duration,
          ]}
          duration={[glitchControls.duration, glitchControls.duration * 2]}
          strength={[glitchControls.strength, glitchControls.strength]}
          blendFunction={BlendFunction.NORMAL}
          opacity={glitchControls.intensity}
        />
      )}
      {/* Pixelation */}
      {pixelationControls.enabled && (
        <Pixelation
          granularity={pixelationControls.granularity}
          blendFunction={BlendFunction.NORMAL}
          opacity={pixelationControls.intensity}
        />
      )}
      {/* Scanline */}
      {scanlineControls.enabled && (
        <Scanline
          density={scanlineControls.density}
          blendFunction={BlendFunction.OVERLAY}
          opacity={scanlineControls.intensity}
        />
      )}
      {/* Dot Screen */}
      {dotScreenControls.enabled && (
        <DotScreen
          scale={dotScreenControls.scale}
          angle={dotScreenControls.angle}
          blendFunction={BlendFunction.NORMAL}
          opacity={dotScreenControls.intensity}
        />
      )}
      {/* Grid */}
      {gridControls.enabled && (
        <Grid
          scale={gridControls.scale}
          lineWidth={gridControls.lineWidth}
          blendFunction={BlendFunction.OVERLAY}
          opacity={gridControls.intensity}
        />
      )}
      {/* Color Effects */}
      {sepiaControls.enabled && (
        <Sepia
          blendFunction={BlendFunction.NORMAL}
          opacity={sepiaControls.intensity}
        />
      )}
      {hueSaturationControls.enabled && (
        <HueSaturation
          hue={hueSaturationControls.hue}
          saturation={hueSaturationControls.saturation}
          blendFunction={BlendFunction.NORMAL}
          opacity={hueSaturationControls.intensity}
        />
      )}
      {brightnessContrastControls.enabled && (
        <BrightnessContrast
          brightness={brightnessContrastControls.brightness}
          contrast={brightnessContrastControls.contrast}
          blendFunction={BlendFunction.NORMAL}
          opacity={brightnessContrastControls.intensity}
        />
      )}
      {colorDepthControls.enabled && (
        <ColorDepth
          bits={colorDepthControls.bits}
          blendFunction={BlendFunction.NORMAL}
          opacity={colorDepthControls.intensity}
        />
      )}
      {/* Noise */}
      {noiseControls.enabled && (
        <Noise
          opacity={noiseControls.opacity}
          blendFunction={BlendFunction.SCREEN}
        />
      )}
      {/* Vignette */}
      {vignetteControls.enabled && (
        <Vignette
          eskil={vignetteControls.eskil}
          offset={vignetteControls.offset}
          darkness={vignetteControls.darkness}
          blendFunction={BlendFunction.NORMAL}
          opacity={vignetteControls.intensity}
        />
      )}
      {/* Autofocus */}
      {autofocusControls.enabled && (
        <Autofocus
          target={autofocusControls.target}
          smoothTime={autofocusControls.smoothTime}
          blendFunction={BlendFunction.NORMAL}
          opacity={autofocusControls.intensity}
        />
      )}
      {/* Color Average */}
      {colorAverageControls.enabled && (
        <ColorAverage
          blendFunction={BlendFunction.NORMAL}
          opacity={colorAverageControls.intensity}
        />
      )}
      {/* God Rays - Disabled due to lightSource dependency */}
      {/* {godRaysControls.enabled && (
        <GodRays
          sun={[0, 0, 0]}
          density={godRaysControls.density}
          decay={godRaysControls.decay}
          weight={godRaysControls.weight}
          exposure={godRaysControls.exposure}
          samples={godRaysControls.samples}
          clampMax={godRaysControls.clampMax}
          blendFunction={BlendFunction.SCREEN}
          opacity={godRaysControls.intensity}
        />
      )} */}
      {/* Lens Flare */}
      {lensFlareControls.enabled && (
        <LensFlare
          blendFunction={BlendFunction.SCREEN}
          opacity={lensFlareControls.intensity}
        />
      )}
      {/* N8AO - Enhanced SSAO */}
      {n8aoControls.enabled && (
        <N8AO
          aoRadius={n8aoControls.aoRadius}
          distanceFalloff={n8aoControls.distanceFalloff}
          intensity={n8aoControls.intensity}
          quality={n8aoControls.quality}
          halfRes={n8aoControls.halfRes}
          screenSpaceRadius={n8aoControls.screenSpaceRadius}
          blendFunction={BlendFunction.MULTIPLY}
        />
      )}
      {/* Selective Bloom - Disabled due to lights dependency */}
      {/* {selectiveBloomControls.enabled && (
        <SelectiveBloom
          luminanceThreshold={selectiveBloomControls.luminanceThreshold}
          luminanceSmoothing={selectiveBloomControls.luminanceSmoothing}
          mipmapBlur={selectiveBloomControls.mipmapBlur}
          height={selectiveBloomControls.height}
          blendFunction={BlendFunction.SCREEN}
          opacity={selectiveBloomControls.intensity}
        />
      )} */}
      {/* Outline */}
      {outlineControls.enabled && (
        <Outline
          selection={[]}
          edgeStrength={outlineControls.thickness * 100}
          pulseSpeed={0}
          visibleEdgeColor={outlineControls.color}
          hiddenEdgeColor={outlineControls.color}
          blur={false}
          xRay={false}
          blendFunction={BlendFunction.ALPHA}
          opacity={outlineControls.intensity}
        />
      )}
      {/* Custom Shaders */}
      {waveControls.enabled && (
        <WaveEffect
          intensity={waveControls.intensity}
          frequency={waveControls.frequency}
          speed={waveControls.speed}
          amplitude={waveControls.amplitude}
        />
      )}
      {rgbSplitControls.enabled && (
        <RGBSplitEffect
          intensity={rgbSplitControls.intensity}
          angle={rgbSplitControls.angle}
          amount={rgbSplitControls.amount}
        />
      )}
      {kaleidoscopeControls.enabled && (
        <KaleidoscopeEffect
          intensity={kaleidoscopeControls.intensity}
          segments={kaleidoscopeControls.segments}
          angle={kaleidoscopeControls.angle}
        />
      )}
      {colorShiftControls.enabled && (
        <ColorShiftEffect
          intensity={colorShiftControls.intensity}
          hueShift={colorShiftControls.hueShift}
          saturation={colorShiftControls.saturation}
          brightness={colorShiftControls.brightness}
        />
      )}
      {fractalNoiseControls.enabled && (
        <FractalNoiseEffect
          intensity={fractalNoiseControls.intensity}
          scale={fractalNoiseControls.scale}
          octaves={fractalNoiseControls.octaves}
          lacunarity={fractalNoiseControls.lacunarity}
          gain={fractalNoiseControls.gain}
        />
      )}
      {/* Edge Outline Effect */}
      {edgeOutlineControls.enabled && (
        <EdgeOutlineEffect
          intensity={edgeOutlineControls.intensity}
          threshold={edgeOutlineControls.threshold}
          color={[
            parseInt(edgeOutlineControls.color.slice(1, 3), 16) / 255,
            parseInt(edgeOutlineControls.color.slice(3, 5), 16) / 255,
            parseInt(edgeOutlineControls.color.slice(5, 7), 16) / 255,
          ]}
          depthSensitivity={edgeOutlineControls.depthSensitivity}
          normalSensitivity={edgeOutlineControls.normalSensitivity}
          thickness={edgeOutlineControls.thickness}
          resolution={[window.innerWidth || 1024, window.innerHeight || 1024]}
        />
      )}
      {/* View Depth Visualization */}
      {viewDepthControls.enabled && (
        <ViewDepthVisualization
          intensity={viewDepthControls.intensity}
          depthMin={viewDepthControls.depthMin}
          depthMax={viewDepthControls.depthMax}
        />
      )}
      {/* Simple World Normal Effect */}
      {simpleWorldNormalControls.enabled && (
        <SimpleWorldNormalEffect
          intensity={simpleWorldNormalControls.intensity}
          mode={simpleWorldNormalControls.mode}
          useWorldSpace={simpleWorldNormalControls.useWorldSpace}
        />
      )}
      {/* Tone Mapping - Should be last */}
      {toneMappingControls.enabled && (
        <ToneMapping
          adaptive={toneMappingControls.adaptive}
          resolution={toneMappingControls.resolution}
          middleGrey={toneMappingControls.middleGrey}
          maxLuminance={toneMappingControls.maxLuminance}
          averageLuminance={toneMappingControls.averageLuminance}
          adaptationRate={toneMappingControls.adaptationRate}
          blendFunction={BlendFunction.NORMAL}
        />
      )}
    </EffectComposer>
  );
};

export default PostEffects;
