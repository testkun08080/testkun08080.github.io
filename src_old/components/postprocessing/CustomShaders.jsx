import React, { forwardRef, useMemo, useContext } from "react";
import { Effect, EffectAttribute } from "postprocessing";
import { Uniform, Matrix4 } from "three";
import { EffectComposerContext } from "@react-three/postprocessing";

// Waves Effect - Creates animated wave distortion
class WaveEffectImpl extends Effect {
  constructor({
    intensity = 0.1,
    frequency = 10.0,
    speed = 1.0,
    amplitude = 0.005,
  } = {}) {
    super(
      "WaveEffect",
      /* glsl */ `
      uniform float uTime;
      uniform float uIntensity;
      uniform float uFrequency; 
      uniform float uSpeed;
      uniform float uAmplitude;
      
      void mainUv(inout vec2 uv) {
        float wave = sin(uv.y * uFrequency + uTime * uSpeed) * uAmplitude * uIntensity;
        uv.x += wave;
      }
      
      void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
        outputColor = inputColor;
      }
    `,
      {
        uniforms: new Map([
          ["uTime", new Uniform(0.0)],
          ["uIntensity", new Uniform(intensity)],
          ["uFrequency", new Uniform(frequency)],
          ["uSpeed", new Uniform(speed)],
          ["uAmplitude", new Uniform(amplitude)],
        ]),
      },
    );
  }

  update(renderer, inputBuffer, deltaTime) {
    this.uniforms.get("uTime").value += deltaTime;
  }

  set intensity(value) {
    this.uniforms.get("uIntensity").value = value;
  }
  set frequency(value) {
    this.uniforms.get("uFrequency").value = value;
  }
  set speed(value) {
    this.uniforms.get("uSpeed").value = value;
  }
  set amplitude(value) {
    this.uniforms.get("uAmplitude").value = value;
  }
}

// RGB Split Effect - Creates chromatic separation
class RGBSplitEffectImpl extends Effect {
  constructor({ intensity = 1.0, angle = 0.0, amount = 0.005 } = {}) {
    super(
      "RGBSplitEffect",
      /* glsl */ `
      uniform float uIntensity;
      uniform float uAngle;
      uniform float uAmount;
      
      void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
        vec2 offset = vec2(cos(uAngle), sin(uAngle)) * uAmount * uIntensity;
        
        float r = texture2D(inputBuffer, uv + offset).r;
        float g = texture2D(inputBuffer, uv).g;
        float b = texture2D(inputBuffer, uv - offset).b;
        
        outputColor = vec4(r, g, b, inputColor.a);
      }
    `,
      {
        uniforms: new Map([
          ["uIntensity", new Uniform(intensity)],
          ["uAngle", new Uniform(angle)],
          ["uAmount", new Uniform(amount)],
        ]),
      },
    );
  }

  set intensity(value) {
    this.uniforms.get("uIntensity").value = value;
  }
  set angle(value) {
    this.uniforms.get("uAngle").value = value;
  }
  set amount(value) {
    this.uniforms.get("uAmount").value = value;
  }
}

// Kaleidoscope Effect - Creates kaleidoscope pattern
class KaleidoscopeEffectImpl extends Effect {
  constructor({ intensity = 1.0, segments = 6.0, angle = 0.0 } = {}) {
    super(
      "KaleidoscopeEffect",
      /* glsl */ `
      uniform float uIntensity;
      uniform float uSegments;
      uniform float uAngle;
      
      void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
        vec2 center = vec2(0.5, 0.5);
        vec2 pos = uv - center;
        
        float radius = length(pos);
        float theta = atan(pos.y, pos.x) + uAngle;
        
        theta = mod(theta, 2.0 * 3.14159 / uSegments) * uSegments;
        
        vec2 kaleidoscopeUv = center + radius * vec2(cos(theta), sin(theta));
        vec4 kaleidoscopeColor = texture2D(inputBuffer, kaleidoscopeUv);
        
        outputColor = mix(inputColor, kaleidoscopeColor, uIntensity);
      }
    `,
      {
        uniforms: new Map([
          ["uIntensity", new Uniform(intensity)],
          ["uSegments", new Uniform(segments)],
          ["uAngle", new Uniform(angle)],
        ]),
      },
    );
  }

  set intensity(value) {
    this.uniforms.get("uIntensity").value = value;
  }
  set segments(value) {
    this.uniforms.get("uSegments").value = value;
  }
  set angle(value) {
    this.uniforms.get("uAngle").value = value;
  }
}

// Color Shift Effect - HSV color manipulation
class ColorShiftEffectImpl extends Effect {
  constructor({
    intensity = 1.0,
    hueShift = 0.0,
    saturation = 1.0,
    brightness = 1.0,
  } = {}) {
    super(
      "ColorShiftEffect",
      /* glsl */ `
      uniform float uIntensity;
      uniform float uHueShift;
      uniform float uSaturation;
      uniform float uBrightness;
      
      vec3 rgb2hsv(vec3 c) {
        vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
        vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
        vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));
        
        float d = q.x - min(q.w, q.y);
        float e = 1.0e-10;
        return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
      }
      
      vec3 hsv2rgb(vec3 c) {
        vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
        vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
        return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
      }
      
      void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
        vec3 hsv = rgb2hsv(inputColor.rgb);
        hsv.x += uHueShift;
        hsv.y *= uSaturation;
        hsv.z *= uBrightness;
        
        vec3 shiftedColor = hsv2rgb(hsv);
        outputColor = vec4(mix(inputColor.rgb, shiftedColor, uIntensity), inputColor.a);
      }
    `,
      {
        uniforms: new Map([
          ["uIntensity", new Uniform(intensity)],
          ["uHueShift", new Uniform(hueShift)],
          ["uSaturation", new Uniform(saturation)],
          ["uBrightness", new Uniform(brightness)],
        ]),
      },
    );
  }

  set intensity(value) {
    this.uniforms.get("uIntensity").value = value;
  }
  set hueShift(value) {
    this.uniforms.get("uHueShift").value = value;
  }
  set saturation(value) {
    this.uniforms.get("uSaturation").value = value;
  }
  set brightness(value) {
    this.uniforms.get("uBrightness").value = value;
  }
}

// Fractal Noise Effect - Procedural noise distortion
class FractalNoiseEffectImpl extends Effect {
  constructor({
    intensity = 1.0,
    scale = 10.0,
    octaves = 4.0,
    lacunarity = 2.0,
    gain = 0.5,
  } = {}) {
    super(
      "FractalNoiseEffect",
      /* glsl */ `
      uniform float uTime;
      uniform float uIntensity;
      uniform float uScale;
      uniform float uOctaves;
      uniform float uLacunarity;
      uniform float uGain;
      
      float random(vec2 st) {
        return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
      }
      
      float noise(vec2 st) {
        vec2 i = floor(st);
        vec2 f = fract(st);
        
        float a = random(i);
        float b = random(i + vec2(1.0, 0.0));
        float c = random(i + vec2(0.0, 1.0));
        float d = random(i + vec2(1.0, 1.0));
        
        vec2 u = f * f * (3.0 - 2.0 * f);
        
        return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
      }
      
      float fbm(vec2 st) {
        float value = 0.0;
        float amplitude = 1.0;
        float frequency = 1.0;
        
        for (int i = 0; i < int(uOctaves); i++) {
          value += amplitude * noise(st * frequency);
          amplitude *= uGain;
          frequency *= uLacunarity;
        }
        
        return value;
      }
      
      void mainUv(inout vec2 uv) {
        vec2 noiseUv = uv * uScale + uTime * 0.1;
        float noiseValue = fbm(noiseUv) * uIntensity * 0.1;
        uv += noiseValue;
      }
      
      void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
        outputColor = inputColor;
      }
    `,
      {
        uniforms: new Map([
          ["uTime", new Uniform(0.0)],
          ["uIntensity", new Uniform(intensity)],
          ["uScale", new Uniform(scale)],
          ["uOctaves", new Uniform(octaves)],
          ["uLacunarity", new Uniform(lacunarity)],
          ["uGain", new Uniform(gain)],
        ]),
      },
    );
  }

  update(renderer, inputBuffer, deltaTime) {
    this.uniforms.get("uTime").value += deltaTime;
  }

  set intensity(value) {
    this.uniforms.get("uIntensity").value = value;
  }
  set scale(value) {
    this.uniforms.get("uScale").value = value;
  }
  set octaves(value) {
    this.uniforms.get("uOctaves").value = value;
  }
  set lacunarity(value) {
    this.uniforms.get("uLacunarity").value = value;
  }
  set gain(value) {
    this.uniforms.get("uGain").value = value;
  }
}

// Export React components
export const WaveEffect = forwardRef((props, ref) => {
  const effect = useMemo(() => new WaveEffectImpl(props), [props]);

  // Update effect properties when props change
  React.useEffect(() => {
    if (props.intensity !== undefined) effect.intensity = props.intensity;
    if (props.frequency !== undefined) effect.frequency = props.frequency;
    if (props.speed !== undefined) effect.speed = props.speed;
    if (props.amplitude !== undefined) effect.amplitude = props.amplitude;
  }, [effect, props]);

  return <primitive ref={ref} object={effect} dispose={null} />;
});

export const RGBSplitEffect = forwardRef((props, ref) => {
  const effect = useMemo(() => new RGBSplitEffectImpl(props), [props]);

  React.useEffect(() => {
    if (props.intensity !== undefined) effect.intensity = props.intensity;
    if (props.angle !== undefined) effect.angle = props.angle;
    if (props.amount !== undefined) effect.amount = props.amount;
  }, [effect, props]);

  return <primitive ref={ref} object={effect} dispose={null} />;
});

export const KaleidoscopeEffect = forwardRef((props, ref) => {
  const effect = useMemo(() => new KaleidoscopeEffectImpl(props), [props]);

  React.useEffect(() => {
    if (props.intensity !== undefined) effect.intensity = props.intensity;
    if (props.segments !== undefined) effect.segments = props.segments;
    if (props.angle !== undefined) effect.angle = props.angle;
  }, [effect, props]);

  return <primitive ref={ref} object={effect} dispose={null} />;
});

export const ColorShiftEffect = forwardRef((props, ref) => {
  const effect = useMemo(() => new ColorShiftEffectImpl(props), [props]);

  React.useEffect(() => {
    if (props.intensity !== undefined) effect.intensity = props.intensity;
    if (props.hueShift !== undefined) effect.hueShift = props.hueShift;
    if (props.saturation !== undefined) effect.saturation = props.saturation;
    if (props.brightness !== undefined) effect.brightness = props.brightness;
  }, [effect, props]);

  return <primitive ref={ref} object={effect} dispose={null} />;
});

export const FractalNoiseEffect = forwardRef((props, ref) => {
  const effect = useMemo(() => new FractalNoiseEffectImpl(props), [props]);

  React.useEffect(() => {
    if (props.intensity !== undefined) effect.intensity = props.intensity;
    if (props.scale !== undefined) effect.scale = props.scale;
    if (props.octaves !== undefined) effect.octaves = props.octaves;
    if (props.lacunarity !== undefined) effect.lacunarity = props.lacunarity;
    if (props.gain !== undefined) effect.gain = props.gain;
  }, [effect, props]);

  return <primitive ref={ref} object={effect} dispose={null} />;
});

// Edge Detection Outline Effect
class EdgeOutlineEffectImpl extends Effect {
  constructor({
    intensity = 1.0,
    threshold = 0.1,
    color = [1, 1, 1],
    depthSensitivity = 1.0,
    normalSensitivity = 1.0,
    thickness = 1.0,
  } = {}) {
    super(
      "EdgeOutlineEffect",
      /* glsl */ `
      uniform float uIntensity;
      uniform float uThreshold;
      uniform vec3 uColor;
      uniform float uDepthSensitivity;
      uniform float uNormalSensitivity;
      uniform float uThickness;
      uniform vec2 uResolution;
      uniform sampler2D normalBuffer;
      
      vec3 getNormal(vec2 uv) {
        #ifdef NORMAL_DEPTH
            vec3 normalDepth = texture2D(normalDepthBuffer, uv);
            return normalDepth.xyz;
        #else
            vec4 normalDepth = vec4(texture2D(normalBuffer, uv).xyz, readDepth(uv));
            return normalDepth.xyz;
        #endif
      }
      
      float sobelDepth(vec2 uv, vec2 texelSize) {
        vec2 offset = texelSize * uThickness;
        
        float tl = readDepth(uv + vec2(-offset.x, -offset.y));
        float tc = readDepth(uv + vec2(0.0, -offset.y));
        float tr = readDepth(uv + vec2(offset.x, -offset.y));
        float ml = readDepth(uv + vec2(-offset.x, 0.0));
        float mc = readDepth(uv);
        float mr = readDepth(uv + vec2(offset.x, 0.0));
        float bl = readDepth(uv + vec2(-offset.x, offset.y));
        float bc = readDepth(uv + vec2(0.0, offset.y));
        float br = readDepth(uv + vec2(offset.x, offset.y));
        
        float sobelX = tl + 2.0 * ml + bl - tr - 2.0 * mr - br;
        float sobelY = tl + 2.0 * tc + tr - bl - 2.0 * bc - br;
        
        return sqrt(sobelX * sobelX + sobelY * sobelY);
      }
      
      float sobelNormal(vec2 uv, vec2 texelSize) {
        vec2 offset = texelSize * uThickness;
        
        float tl = length(getNormal(uv + vec2(-offset.x, -offset.y)));
        float tc = length(getNormal(uv + vec2(0.0, -offset.y)));
        float tr = length(getNormal(uv + vec2(offset.x, -offset.y)));
        float ml = length(getNormal(uv + vec2(-offset.x, 0.0)));
        float mc = length(getNormal(uv));
        float mr = length(getNormal(uv + vec2(offset.x, 0.0)));
        float bl = length(getNormal(uv + vec2(-offset.x, offset.y)));
        float bc = length(getNormal(uv + vec2(0.0, offset.y)));
        float br = length(getNormal(uv + vec2(offset.x, offset.y)));
        
        float sobelX = tl + 2.0 * ml + bl - tr - 2.0 * mr - br;
        float sobelY = tl + 2.0 * tc + tr - bl - 2.0 * bc - br;
        
        return sqrt(sobelX * sobelX + sobelY * sobelY);
      }
      
      void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
        vec2 texelSize = 1.0 / uResolution;
        
        float depthEdge = sobelDepth(uv, texelSize) * uDepthSensitivity;
        float normalEdge = sobelNormal(uv, texelSize) * uNormalSensitivity;
        
        float edge = max(depthEdge, normalEdge);
        float edgeFactor = smoothstep(uThreshold * 0.5, uThreshold, edge);
        
        vec3 outlineColor = mix(inputColor.rgb, uColor, edgeFactor * uIntensity);
        outputColor = vec4(outlineColor, inputColor.a);
      }
    `,
      {
        uniforms: new Map([
          ["uIntensity", new Uniform(intensity)],
          ["uThreshold", new Uniform(threshold)],
          ["uColor", new Uniform(color)],
          ["uDepthSensitivity", new Uniform(depthSensitivity)],
          ["uNormalSensitivity", new Uniform(normalSensitivity)],
          ["uThickness", new Uniform(thickness)],
          ["uResolution", new Uniform([1024, 1024])],
        ]),
        defines: new Map([["NORMAL_PASS_ENABLED", "1"]]),
      },
    );
  }

  set intensity(value) {
    this.uniforms.get("uIntensity").value = value;
  }
  set threshold(value) {
    this.uniforms.get("uThreshold").value = value;
  }
  set color(value) {
    this.uniforms.get("uColor").value = value;
  }
  set depthSensitivity(value) {
    this.uniforms.get("uDepthSensitivity").value = value;
  }
  set normalSensitivity(value) {
    this.uniforms.get("uNormalSensitivity").value = value;
  }
  set thickness(value) {
    this.uniforms.get("uThickness").value = value;
  }
  set resolution(value) {
    this.uniforms.get("uResolution").value = value;
  }
}

// View Depth Visualization Effect - Enhanced view space depth visualization
class ViewDepthVisualizationImpl extends Effect {
  constructor({ intensity = 1.0, depthMin = 0.0, depthMax = 1.0 } = {}) {
    super(
      "ViewDepthVisualization",
      /* glsl */ `
      uniform float uIntensity;
      uniform float uDepthMin;
      uniform float uDepthMax;
      
      void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
        // Read depth value
        float depth = readDepth(uv);
        
        // Remap depth from [depthMin, depthMax] to [0, 1]
        float remappedDepth = clamp((depth - uDepthMin) / (uDepthMax - uDepthMin), 0.0, 1.0);
        // float remappedDepth = mix(uDepthMin, uDepthMax, depth);

        // Mix with input color
        outputColor = vec4(mix(inputColor.rgb, vec3(remappedDepth), uIntensity), inputColor.a);
      }
    `,

      {
        attributes: EffectAttribute.DEPTH,
        uniforms: new Map([
          ["uIntensity", new Uniform(intensity)],
          ["uDepthMin", new Uniform(depthMin)],
          ["uDepthMax", new Uniform(depthMax)],
        ]),
      },
    );
  }

  set intensity(value) {
    this.uniforms.get("uIntensity").value = value;
  }

  set depthMin(value) {
    this.uniforms.get("uDepthMin").value = value;
  }

  set depthMax(value) {
    this.uniforms.get("uDepthMax").value = value;
  }
}

export const EdgeOutlineEffect = forwardRef((props, ref) => {
  const effect = useMemo(() => new EdgeOutlineEffectImpl(props), [props]);

  React.useEffect(() => {
    if (props.intensity !== undefined) effect.intensity = props.intensity;
    if (props.threshold !== undefined) effect.threshold = props.threshold;
    if (props.color !== undefined) effect.color = props.color;
    if (props.depthSensitivity !== undefined)
      effect.depthSensitivity = props.depthSensitivity;
    if (props.normalSensitivity !== undefined)
      effect.normalSensitivity = props.normalSensitivity;
    if (props.thickness !== undefined) effect.thickness = props.thickness;
    if (props.resolution !== undefined) effect.resolution = props.resolution;
  }, [effect, props]);

  return <primitive ref={ref} object={effect} dispose={null} />;
});

export const ViewDepthVisualization = forwardRef((props, ref) => {
  const effect = useMemo(() => new ViewDepthVisualizationImpl(props), [props]);

  React.useEffect(() => {
    if (props.intensity !== undefined) effect.intensity = props.intensity;
    if (props.depthMin !== undefined) effect.depthMin = props.depthMin;
    if (props.depthMax !== undefined) effect.depthMax = props.depthMax;
  }, [effect, props]);

  return <primitive ref={ref} object={effect} dispose={null} />;
});

// Simple World Normal Post Effect - Direct world normal visualization
class SimpleWorldNormalEffectImpl extends Effect {
  constructor({
    normalBuffer,
    intensity = 1.0,
    mode = 0,
    useWorldSpace = true,
  }) {
    super(
      "SimpleWorldNormalEffect",
      /* glsl */ `
      uniform sampler2D normalBuffer;
      uniform float uIntensity;
      uniform int uMode;
      uniform bool uUseWorldSpace;
      uniform mat4 cameraMatrixWorld;
      uniform mat4 viewMatrix;
      uniform mat4 projectionMatrix;
      uniform mat4 inverseProjectionMatrix;
      
      // Convert view space normal to world space
      vec3 viewToWorldNormal(vec3 viewNormal) {
        // Transform view space normal to world space
        // viewMatrix transforms world to view, so we need the inverse transpose
        vec4 worldNormal = vec4(viewNormal, 1.0) * viewMatrix;
        // vec3 worldNormal = normalize(normalMatrix * viewNormal);
        return worldNormal.xyz;
      }
      
      // Enhanced normal visualization modes
      vec3 visualizeNormal(vec3 normal, int mode) {
        vec3 color;
        vec3 n = normalize(normal);
        
        if (mode == 0) {
          // Standard RGB visualization - normals as RGB
          color = n * 0.5 + 0.5; // Remap from [-1,1] to [0,1]
        } else if (mode == 1) {
          // Grayscale intensity based on normal magnitude
          float intensity = length(n);
          color = vec3(intensity);
        } else if (mode == 2) {
          // X component (Red channel) visualization
          float x = n.x * 0.5 + 0.5;
          color = vec3(x, 0.2 * (1.0 - x), 0.2 * (1.0 - x));
        } else if (mode == 3) {
          // Y component (Green channel) visualization  
          float y = n.y * 0.5 + 0.5;
          color = vec3(0.2 * (1.0 - y), y, 0.2 * (1.0 - y));
        } else if (mode == 4) {
          // Z component (Blue channel) visualization
          float z = n.z * 0.5 + 0.5;
          color = vec3(0.2 * (1.0 - z), 0.2 * (1.0 - z), z);
        } else {
          // Heat map based on normal direction
          float heat = dot(n, vec3(0.0, 1.0, 0.0)) * 0.5 + 0.5;
          color = mix(vec3(0.0, 0.0, 1.0), vec3(1.0, 0.0, 0.0), heat);
        }
        
        return color;
      }
      
      void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
        // Read normal from normal buffer (assumed to be in view space)
        vec3 viewSpaceNormal = texture2D(normalBuffer, uv).xyz;
        viewSpaceNormal = viewSpaceNormal * 2.0 - 1.0; // Remap from [0,1] to [-1,1]
        
        // Choose between view space and world space normals
        vec3 normal;
        if (uUseWorldSpace) {
          // Convert view space normal to world space 
          normal = viewToWorldNormal(viewSpaceNormal);
        } else {
          // Use view space normals directly
          normal = viewSpaceNormal;
        }
        
        // Generate visualization color based on selected mode
        vec3 normalColor = visualizeNormal(normal, uMode);
        
        // Mix with input color based on intensity
        outputColor = vec4(mix(inputColor.rgb, normalColor, uIntensity), inputColor.a);
      }
      `,
      {
        uniforms: new Map([
          ["normalBuffer", new Uniform(normalBuffer)],
          ["uIntensity", new Uniform(intensity)],
          ["uMode", new Uniform(mode)],
          ["uUseWorldSpace", new Uniform(useWorldSpace)],
          ["cameraMatrixWorld", new Uniform(new Matrix4())],
          ["viewMatrix", new Uniform(new Matrix4())],
          ["projectionMatrix", new Uniform(new Matrix4())],
          ["inverseProjectionMatrix", new Uniform(new Matrix4())],
        ]),
      },
    );
  }

  set intensity(value) {
    this.uniforms.get("uIntensity").value = value;
  }

  set mode(value) {
    this.uniforms.get("uMode").value = value;
  }

  set useWorldSpace(value) {
    this.uniforms.get("uUseWorldSpace").value = value;
  }

  set cameraMatrixWorld(matrix) {
    this.uniforms.get("cameraMatrixWorld").value = matrix;
  }

  set viewMatrix(matrix) {
    this.uniforms.get("viewMatrix").value = matrix;
  }

  set projectionMatrix(matrix) {
    this.uniforms.get("projectionMatrix").value.copy(matrix);
  }

  set inverseProjectionMatrix(matrix) {
    this.uniforms.get("inverseProjectionMatrix").value.copy(matrix);
  }
}

export const SimpleWorldNormalEffect = forwardRef((props, ref) => {
  const { normalPass, camera } = useContext(EffectComposerContext);

  const effect = useMemo(
    () =>
      new SimpleWorldNormalEffectImpl({
        normalBuffer: normalPass?.texture,
        ...props,
      }),
    [normalPass, props],
  );

  // Update camera matrices
  React.useEffect(() => {
    if (camera) {
      effect.cameraMatrixWorld = camera.matrixWorld;
      effect.viewMatrix = camera.matrixWorldInverse;
      effect.projectionMatrix = camera.projectionMatrix;
      effect.inverseProjectionMatrix = camera.projectionMatrixInverse;
    }
  }, [effect, camera]);

  // Update other properties
  React.useEffect(() => {
    if (props.intensity !== undefined) effect.intensity = props.intensity;
    if (props.mode !== undefined) effect.mode = props.mode;
    if (props.useWorldSpace !== undefined)
      effect.useWorldSpace = props.useWorldSpace;
  }, [effect, props]);

  return <primitive ref={ref} object={effect} dispose={null} />;
});
