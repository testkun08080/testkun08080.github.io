import { useEffect, useRef, useState, type CSSProperties } from "react";
import {
  CanvasTexture,
  Color,
  LinearFilter,
  Mesh,
  OrthographicCamera,
  PlaneGeometry,
  SRGBColorSpace,
  Scene,
  ShaderMaterial,
  Vector2,
  WebGLRenderer,
} from "three";

export type FlowMode = "radial" | "directional";

export type HeroLogoInkWebGLProps = {
  className?: string;
  style?: CSSProperties;
  paused?: boolean;

  // logo placement
  logoUrl?: string;
  logoSize?: number;
  centerX?: number;
  centerY?: number;

  // multi-instance placement
  instanceCount?: number; // 1..MAX_INSTANCES
  instanceRadius?: number; // ring radius around (centerX, centerY)
  instanceAngleOffset?: number; // ring start angle, degrees
  instanceRotation?: number; // per-step rotation in degrees, applied as i * value

  // ink shown INSIDE the logo mask
  inkScale?: number;
  warpScale?: number;
  warpAmount?: number;
  warpSpeed?: number;
  inkLight?: string;
  inkDark?: string;
  inkContrast?: number;
  inkOpacity?: number;

  // UV distortion
  uvDistortScale?: number;
  uvDistortAmount?: number;
  uvDistortSpeed?: number;

  // flow direction
  flowMode?: FlowMode;
  flowAngle?: number; // degrees, only used in directional mode
  flowStrength?: number;
  flowRadius?: number; // distance at which radialFactor saturates to 1
  flowFalloff?: number; // power curve (1 = linear, >1 keeps center quieter)
  flowInvert?: boolean; // reverse flow direction

  // mouse interaction
  mouseEnabled?: boolean;
  mouseStrength?: number;
  mouseRadius?: number; // in uv units (aspect-corrected)

  // edge band
  blurRadius?: number;
  edgeWidth?: number;
  edgeStrength?: number;
  edgeColor?: string;
  edgeInkMix?: number;
};

const VERTEX_SHADER = `
varying vec2 v_uv;
void main() {
  v_uv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const MAX_INSTANCES = 12;

const FRAGMENT_SHADER = `
#define MAX_INSTANCES ${MAX_INSTANCES}
precision highp float;

varying vec2 v_uv;

uniform float u_time;
uniform float u_paused;
uniform vec2  u_resolution;

uniform sampler2D u_logoTex;
uniform float u_logoReady;
uniform float u_logoSize;
uniform float u_logoAspect;
uniform vec2  u_center;

uniform int   u_instanceCount;
uniform float u_instanceRadius;
uniform float u_instanceAngleOffset; // radians
uniform float u_instanceRotation;    // radians (per-step, accumulated as i * value)

uniform float u_inkScale;
uniform float u_warpScale;
uniform float u_warpAmount;
uniform float u_warpSpeed;
uniform vec3  u_inkLight;
uniform vec3  u_inkDark;
uniform float u_inkContrast;
uniform float u_inkOpacity;

uniform float u_uvDistortScale;
uniform float u_uvDistortAmount;
uniform float u_uvDistortSpeed;

uniform float u_flowMode;        // 0 = directional, 1 = radial
uniform vec2  u_flowDir;         // unit vector (directional)
uniform float u_flowStrength;
uniform float u_flowRadius;      // distance at which radialFactor reaches 1.0
uniform float u_flowFalloff;     // power curve on radialFactor (1 = linear)

uniform vec2  u_mouse;           // aspect-corrected uv space
uniform float u_mouseActive;
uniform float u_mouseStrength;
uniform float u_mouseRadius;

uniform float u_blurRadius;
uniform float u_edgeWidth;
uniform float u_edgeStrength;
uniform vec3  u_edgeColor;
uniform float u_edgeInkMix;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 345.45));
  p += dot(p, p + 34.345);
  return fract(p.x * p.y);
}

float vnoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 5; i++) {
    v += a * vnoise(p);
    p = p * 2.03 + vec2(13.1, 7.7);
    a *= 0.5;
  }
  return v;
}

float sampleLogoAlpha(vec2 luv) {
  if (u_logoReady < 0.5) return 0.0;
  if (luv.x < 0.0 || luv.x > 1.0 || luv.y < 0.0 || luv.y > 1.0) return 0.0;
  return texture2D(u_logoTex, luv).a;
}

void main() {
  vec2 uv = v_uv * 2.0 - 1.0;
  float aspect = u_resolution.x / max(u_resolution.y, 1.0);
  uv.x *= aspect;

  float t = mix(0.0, u_time, 1.0 - u_paused);

  vec3 col = vec3(0.0);
  float alpha = 0.0;

  // -------- flow (computed in screen space, shared by all instances) --------
  vec2 toCenter = uv - u_center;
  float rLen = length(toCenter);
  float radialFactor = clamp(rLen / max(u_flowRadius, 1e-4), 0.0, 1.0);
  radialFactor = pow(radialFactor, max(u_flowFalloff, 1e-4));
  vec2 radialDir = toCenter / max(rLen, 1e-4);
  vec2 dir = mix(u_flowDir, radialDir, u_flowMode);
  vec2 flowOffset = dir * (t * u_warpSpeed * u_flowStrength * radialFactor);

  // -------- mouse (screen-space) --------
  vec2 mouseVec = uv - u_mouse;
  float mouseDist = length(mouseVec);
  float mouseFall = exp(-pow(mouseDist / max(u_mouseRadius, 1e-3), 2.0));
  vec2 mouseDir = mouseVec / max(mouseDist, 1e-3);
  vec2 mouseOffset = mouseDir * mouseFall * u_mouseStrength * u_mouseActive;

  // -------- per-instance composition --------
  float halfH = u_logoSize;
  float halfW = halfH * u_logoAspect;
  int count = u_instanceCount;
  if (count < 1) count = 1;
  if (count > MAX_INSTANCES) count = MAX_INSTANCES;

  for (int i = 0; i < MAX_INSTANCES; i++) {
    if (i >= count) break;

    // ring placement angle: 0 for single instance, otherwise evenly spaced.
    float ringAngle = u_instanceAngleOffset;
    if (count > 1) {
      ringAngle += (6.28318530718 / float(count)) * float(i);
    }

    // self rotation accumulates: 0 for i=0, i * u_instanceRotation otherwise.
    float selfAngle = u_instanceRotation * float(i);

    // instance position on the ring (a single instance sits at the center)
    float ringR = u_instanceRadius;
    if (count <= 1) ringR = 0.0;
    vec2 instCenter = u_center + vec2(cos(ringAngle), sin(ringAngle)) * ringR;

    // transform screen point into this instance's local space (apply self rotation).
    vec2 lp = uv - instCenter;
    float cs = cos(-selfAngle);
    float sn = sin(-selfAngle);
    vec2 lpRot = vec2(cs * lp.x - sn * lp.y, sn * lp.x + cs * lp.y);
    vec2 luv = vec2(lpRot.x / (2.0 * halfW) + 0.5,
                    0.5 - lpRot.y / (2.0 * halfH));

    // UV distortion (per instance, but using shared flow / mouse offsets)
    vec2 dscaledLuv = luv * u_uvDistortScale + flowOffset * u_uvDistortScale;
    vec2 distort = vec2(
      fbm(dscaledLuv + vec2(float(i) * 1.7,  t * u_uvDistortSpeed)),
      fbm(dscaledLuv + vec2(11.1 + float(i) * 2.3, -t * u_uvDistortSpeed))
    ) - 0.5;
    vec2 dluv = luv + distort * u_uvDistortAmount + mouseOffset;

    float logoA = sampleLogoAlpha(dluv);

    // blurred mask
    float br = u_blurRadius;
    float blurA = 0.0;
    blurA += sampleLogoAlpha(dluv + vec2( br,    0.0));
    blurA += sampleLogoAlpha(dluv + vec2(-br,    0.0));
    blurA += sampleLogoAlpha(dluv + vec2( 0.0,   br));
    blurA += sampleLogoAlpha(dluv + vec2( 0.0,  -br));
    blurA += sampleLogoAlpha(dluv + vec2( br*0.7,  br*0.7));
    blurA += sampleLogoAlpha(dluv + vec2(-br*0.7,  br*0.7));
    blurA += sampleLogoAlpha(dluv + vec2( br*0.7, -br*0.7));
    blurA += sampleLogoAlpha(dluv + vec2(-br*0.7, -br*0.7));
    blurA += sampleLogoAlpha(dluv + vec2( br*1.6,  0.0));
    blurA += sampleLogoAlpha(dluv + vec2(-br*1.6,  0.0));
    blurA += sampleLogoAlpha(dluv + vec2( 0.0,   br*1.6));
    blurA += sampleLogoAlpha(dluv + vec2( 0.0,  -br*1.6));
    blurA *= 1.0 / 12.0;
    blurA = mix(blurA, logoA, 0.15);

    // ink fbm inside the mask
    vec2 wuv = dluv * u_warpScale + flowOffset * u_warpScale;
    vec2 warp = vec2(
      fbm(wuv + vec2(float(i) * 3.1,  t * u_warpSpeed)),
      fbm(wuv + vec2(7.3 + float(i) * 1.9, -t * u_warpSpeed))
    ) - 0.5;
    vec2 inkSampleUV = dluv * u_inkScale + warp * u_warpAmount + flowOffset * u_inkScale;
    float ink = fbm(inkSampleUV + vec2(float(i) * 5.7, 0.0));
    ink = clamp((ink - 0.5) * u_inkContrast + 0.5, 0.0, 1.0);

    vec3 inkCol = mix(u_inkLight, u_inkDark, ink);
    float inside = logoA * u_inkOpacity;
    col = mix(col, inkCol, inside);
    alpha = max(alpha, inside);

    // edge band
    float edge = max(0.0, blurA - logoA);
    edge = smoothstep(0.0, max(u_edgeWidth, 1e-4), edge);
    vec3 edgeCol = mix(u_edgeColor, u_inkDark, ink * u_edgeInkMix);
    float edgeAlpha = clamp(edge * u_edgeStrength, 0.0, 1.0);
    col = mix(col, edgeCol, edgeAlpha);
    alpha = max(alpha, edgeAlpha);
  }

  gl_FragColor = vec4(col, alpha);
}
`;

function hexToVec3(hex: string): [number, number, number] {
  const c = new Color(hex);
  return [c.r, c.g, c.b];
}

function setVec3(target: number[], src: [number, number, number]) {
  target[0] = src[0];
  target[1] = src[1];
  target[2] = src[2];
}

function isMobileDevice(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(max-width: 768px)").matches || navigator.maxTouchPoints > 0;
}

export function HeroLogoInkWebGL({
  className,
  style,
  paused = false,
  logoUrl = "/logo-trans.svg",
  logoSize = 0.1,
  centerX = 0.0,
  centerY = 0.0,
  instanceCount = 1,
  instanceRadius = 0.5,
  instanceAngleOffset = 0,
  instanceRotation = 0,
  inkScale = 4.0,
  warpScale = 2.0,
  warpAmount = 0.6,
  warpSpeed = 0.05,
  inkLight = "#cbbfa8",
  inkDark = "#1a1714",
  inkContrast = 1.4,
  inkOpacity = 0.95,
  uvDistortScale = 2.5,
  uvDistortAmount = 0.04,
  uvDistortSpeed = 0.05,
  flowMode = "directional",
  flowAngle = 90,
  flowStrength = 1.0,
  flowRadius = 1.2,
  flowFalloff = 1.0,
  flowInvert = false,
  mouseEnabled = true,
  mouseStrength = 0.06,
  mouseRadius = 0.4,
  blurRadius = 0.04,
  edgeWidth = 0.6,
  edgeStrength = 1.6,
  edgeColor = "#1a1714",
  edgeInkMix = 0.7,
}: HeroLogoInkWebGLProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [unavailable, setUnavailable] = useState(false);

  const propsRef = useRef({
    paused,
    logoSize,
    centerX,
    centerY,
    instanceCount,
    instanceRadius,
    instanceAngleOffset,
    instanceRotation,
    inkScale,
    warpScale,
    warpAmount,
    warpSpeed,
    inkLight,
    inkDark,
    inkContrast,
    inkOpacity,
    uvDistortScale,
    uvDistortAmount,
    uvDistortSpeed,
    flowMode,
    flowAngle,
    flowStrength,
    flowRadius,
    flowFalloff,
    flowInvert,
    mouseEnabled,
    mouseStrength,
    mouseRadius,
    blurRadius,
    edgeWidth,
    edgeStrength,
    edgeColor,
    edgeInkMix,
  });
  propsRef.current = {
    paused,
    logoSize,
    centerX,
    centerY,
    instanceCount,
    instanceRadius,
    instanceAngleOffset,
    instanceRotation,
    inkScale,
    warpScale,
    warpAmount,
    warpSpeed,
    inkLight,
    inkDark,
    inkContrast,
    inkOpacity,
    uvDistortScale,
    uvDistortAmount,
    uvDistortSpeed,
    flowMode,
    flowAngle,
    flowStrength,
    flowRadius,
    flowFalloff,
    flowInvert,
    mouseEnabled,
    mouseStrength,
    mouseRadius,
    blurRadius,
    edgeWidth,
    edgeStrength,
    edgeColor,
    edgeInkMix,
  };

  // mouse target (target value the shader interpolates toward)
  // stored in aspect-corrected uv space, computed at pointer-move time.
  const mouseTargetRef = useRef({ x: 0, y: 0, active: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let renderer: WebGLRenderer;
    try {
      renderer = new WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
        premultipliedAlpha: true,
      });
    } catch {
      setUnavailable(true);
      return;
    }
    renderer.outputColorSpace = SRGBColorSpace;
    renderer.setClearColor(0x000000, 0);

    const scene = new Scene();
    const camera = new OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
    camera.position.z = 1;

    const placeholderCanvas = document.createElement("canvas");
    placeholderCanvas.width = 1;
    placeholderCanvas.height = 1;
    const placeholderTex = new CanvasTexture(placeholderCanvas);
    placeholderTex.minFilter = LinearFilter;
    placeholderTex.magFilter = LinearFilter;

    const angleRad = (flowAngle * Math.PI) / 180;
    const uniforms = {
      u_time: { value: 0 },
      u_paused: { value: paused ? 1 : 0 },
      u_resolution: { value: new Vector2(1, 1) },
      u_logoTex: { value: placeholderTex },
      u_logoReady: { value: 0 },
      u_logoSize: { value: logoSize },
      u_logoAspect: { value: 1 },
      u_center: { value: new Vector2(centerX, centerY) },
      u_instanceCount: {
        value: Math.max(1, Math.min(12, Math.round(instanceCount))),
      },
      u_instanceRadius: { value: instanceRadius },
      u_instanceAngleOffset: { value: (instanceAngleOffset * Math.PI) / 180 },
      u_instanceRotation: { value: (instanceRotation * Math.PI) / 180 },
      u_inkScale: { value: inkScale },
      u_warpScale: { value: warpScale },
      u_warpAmount: { value: warpAmount },
      u_warpSpeed: { value: warpSpeed },
      u_inkLight: { value: hexToVec3(inkLight) },
      u_inkDark: { value: hexToVec3(inkDark) },
      u_inkContrast: { value: inkContrast },
      u_inkOpacity: { value: inkOpacity },
      u_uvDistortScale: { value: uvDistortScale },
      u_uvDistortAmount: { value: uvDistortAmount },
      u_uvDistortSpeed: { value: uvDistortSpeed },
      u_flowMode: { value: flowMode === "radial" ? 1 : 0 },
      u_flowDir: { value: new Vector2(Math.cos(angleRad), Math.sin(angleRad)) },
      u_flowStrength: { value: flowStrength },
      u_flowRadius: { value: flowRadius },
      u_flowFalloff: { value: flowFalloff },
      u_mouse: { value: new Vector2(0, 0) },
      u_mouseActive: { value: 0 },
      u_mouseStrength: { value: mouseStrength },
      u_mouseRadius: { value: mouseRadius },
      u_blurRadius: { value: blurRadius },
      u_edgeWidth: { value: edgeWidth },
      u_edgeStrength: { value: edgeStrength },
      u_edgeColor: { value: hexToVec3(edgeColor) },
      u_edgeInkMix: { value: edgeInkMix },
    };

    const material = new ShaderMaterial({
      vertexShader: VERTEX_SHADER,
      fragmentShader: FRAGMENT_SHADER,
      uniforms,
    });
    const geometry = new PlaneGeometry(2, 2);
    const mesh = new Mesh(geometry, material);
    scene.add(mesh);

    // ---- fetch logo ----
    let logoTex: CanvasTexture | null = null;
    let cancelled = false;
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      if (cancelled) return;
      const maxSide = 1024;
      const ratio = img.width / img.height;
      let tw = img.width;
      let th = img.height;
      if (Math.max(tw, th) > maxSide) {
        if (tw >= th) {
          tw = maxSide;
          th = Math.round(maxSide / ratio);
        } else {
          th = maxSide;
          tw = Math.round(maxSide * ratio);
        }
      }
      const off = document.createElement("canvas");
      off.width = tw;
      off.height = th;
      const ctx = off.getContext("2d");
      if (!ctx) return;
      ctx.clearRect(0, 0, tw, th);
      ctx.drawImage(img, 0, 0, tw, th);
      logoTex = new CanvasTexture(off);
      logoTex.minFilter = LinearFilter;
      logoTex.magFilter = LinearFilter;
      logoTex.colorSpace = SRGBColorSpace;
      logoTex.needsUpdate = true;
      uniforms.u_logoTex.value = logoTex;
      uniforms.u_logoAspect.value = tw / th;
      uniforms.u_logoReady.value = 1;
    };
    img.onerror = () => {};
    img.src = logoUrl;

    // Cap DPR at 1.5 on mobile to reduce GPU load significantly
    const mobile = isMobileDevice();
    const maxDpr = mobile ? 1.5 : 2;
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, maxDpr);
      const w = Math.max(1, canvas.clientWidth);
      const h = Math.max(1, canvas.clientHeight);
      renderer.setPixelRatio(dpr);
      renderer.setSize(w, h, false);
      uniforms.u_resolution.value.set(w, h);
    };

    const start = performance.now();
    let rafId = 0;
    let running = true;

    // current (smoothed) mouse uniform values
    const mouseCurrent = { x: 0, y: 0, active: 0 };

    // convert client pixel position → aspect-corrected uv space matching shader
    const updateMouseTargetFromEvent = (clientX: number, clientY: number) => {
      const rect = canvas.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      if (w <= 0 || h <= 0) return;
      const px = (clientX - rect.left) / w; // 0..1
      const py = (clientY - rect.top) / h; // 0..1
      const aspect = w / h;
      const ux = (px * 2.0 - 1.0) * aspect;
      const uy = -(py * 2.0 - 1.0);
      mouseTargetRef.current.x = ux;
      mouseTargetRef.current.y = uy;
      mouseTargetRef.current.active = 1;
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!propsRef.current.mouseEnabled) return;
      updateMouseTargetFromEvent(e.clientX, e.clientY);
    };
    const onPointerLeave = () => {
      mouseTargetRef.current.active = 0;
    };

    const target = window;
    target.addEventListener("pointermove", onPointerMove, { passive: true });
    canvas.addEventListener("pointerleave", onPointerLeave);

    const syncUniforms = (elapsed: number, dt: number) => {
      const p = propsRef.current;
      uniforms.u_time.value = elapsed;
      uniforms.u_paused.value = p.paused ? 1 : 0;
      uniforms.u_logoSize.value = p.logoSize;
      uniforms.u_center.value.set(p.centerX, p.centerY);
      uniforms.u_instanceCount.value = Math.max(
        1,
        Math.min(12, Math.round(p.instanceCount)),
      );
      uniforms.u_instanceRadius.value = p.instanceRadius;
      uniforms.u_instanceAngleOffset.value =
        (p.instanceAngleOffset * Math.PI) / 180;
      uniforms.u_instanceRotation.value = (p.instanceRotation * Math.PI) / 180;
      uniforms.u_inkScale.value = p.inkScale;
      uniforms.u_warpScale.value = p.warpScale;
      uniforms.u_warpAmount.value = p.warpAmount;
      uniforms.u_warpSpeed.value = p.warpSpeed;
      setVec3(
        uniforms.u_inkLight.value as unknown as number[],
        hexToVec3(p.inkLight),
      );
      setVec3(
        uniforms.u_inkDark.value as unknown as number[],
        hexToVec3(p.inkDark),
      );
      uniforms.u_inkContrast.value = p.inkContrast;
      uniforms.u_inkOpacity.value = p.inkOpacity;
      uniforms.u_uvDistortScale.value = p.uvDistortScale;
      uniforms.u_uvDistortAmount.value = p.uvDistortAmount;
      uniforms.u_uvDistortSpeed.value = p.uvDistortSpeed;

      // flow
      uniforms.u_flowMode.value = p.flowMode === "radial" ? 1 : 0;
      const a = (p.flowAngle * Math.PI) / 180;
      uniforms.u_flowDir.value.set(Math.cos(a), Math.sin(a));
      uniforms.u_flowStrength.value = p.flowInvert
        ? -p.flowStrength
        : p.flowStrength;
      uniforms.u_flowRadius.value = p.flowRadius;
      uniforms.u_flowFalloff.value = p.flowFalloff;

      // mouse smoothing (exp lerp)
      const k = 1 - Math.exp(-dt * 8.0);
      const tgt = mouseTargetRef.current;
      const targetActive = p.mouseEnabled ? tgt.active : 0;
      mouseCurrent.x += (tgt.x - mouseCurrent.x) * k;
      mouseCurrent.y += (tgt.y - mouseCurrent.y) * k;
      mouseCurrent.active += (targetActive - mouseCurrent.active) * k;
      uniforms.u_mouse.value.set(mouseCurrent.x, mouseCurrent.y);
      uniforms.u_mouseActive.value = mouseCurrent.active;
      uniforms.u_mouseStrength.value = p.mouseStrength;
      uniforms.u_mouseRadius.value = p.mouseRadius;

      uniforms.u_blurRadius.value = p.blurRadius;
      uniforms.u_edgeWidth.value = p.edgeWidth;
      uniforms.u_edgeStrength.value = p.edgeStrength;
      setVec3(
        uniforms.u_edgeColor.value as unknown as number[],
        hexToVec3(p.edgeColor),
      );
      uniforms.u_edgeInkMix.value = p.edgeInkMix;
    };

    // Initial resize before first frame
    resize();

    let lastNow = start;
    const draw = (now: number) => {
      if (!running) return;
      const elapsed = (now - start) / 1000;
      const dt = Math.min(0.1, (now - lastNow) / 1000);
      lastNow = now;
      syncUniforms(elapsed, dt);
      renderer.render(scene, camera);
      rafId = window.requestAnimationFrame(draw);
    };

    const handleVisibility = () => {
      if (document.hidden) {
        if (rafId) window.cancelAnimationFrame(rafId);
        rafId = 0;
      } else if (!rafId) {
        lastNow = performance.now();
        rafId = window.requestAnimationFrame(draw);
      }
    };

    rafId = window.requestAnimationFrame(draw);
    document.addEventListener("visibilitychange", handleVisibility);

    // resize only on actual size changes, not every frame
    const ro = new ResizeObserver(() => resize());
    ro.observe(canvas);

    return () => {
      cancelled = true;
      running = false;
      if (rafId) window.cancelAnimationFrame(rafId);
      document.removeEventListener("visibilitychange", handleVisibility);
      target.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerleave", onPointerLeave);
      ro.disconnect();
      scene.remove(mesh);
      geometry.dispose();
      material.dispose();
      placeholderTex.dispose();
      if (logoTex) logoTex.dispose();
      renderer.dispose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [logoUrl]);

  if (unavailable) return null;

  return (
    <canvas ref={canvasRef} className={className} style={style} aria-hidden />
  );
}
