import { useEffect, useRef } from "react";

const SCALE = 0.28;
const DESKTOP_FPS = 18;
const MOBILE_FPS = 10;
const SCROLLING_FPS = 4;
const REDUCED_MOTION_FPS = 2;
const SCROLL_IDLE_MS = 140;
const NOISE_BUFFER_COUNT = 4;
const TARGET_PATHS = new Set(["/", "/index", "/production", "/dev-integrated"]);

/**
 * 低解像度 Canvas で毎フレーム更新するグレイン + noise.png タイルの微細な揺らぎ。
 * app の NoiseCanvas / Layout の grain を参考に、動きを足した版。
 */
export function AnimatedNoise() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reducedRef = useRef(false);
  const mobileRef = useRef(false);
  const isScrollingRef = useRef(false);
  const idleTimerRef = useRef<number | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mobileMq = window.matchMedia("(max-width: 768px), (pointer: coarse)");
    reducedRef.current = mq.matches;
    mobileRef.current = mobileMq.matches;
    const onMq = () => {
      reducedRef.current = mq.matches;
    };
    const onMobileMq = () => {
      mobileRef.current = mobileMq.matches;
      resize();
    };
    mq.addEventListener("change", onMq);
    mobileMq.addEventListener("change", onMobileMq);

    const canvas = canvasRef.current;
    if (!canvas) {
      return () => {
        mq.removeEventListener("change", onMq);
        mobileMq.removeEventListener("change", onMobileMq);
      };
    }

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) {
      return () => {
        mq.removeEventListener("change", onMq);
        mobileMq.removeEventListener("change", onMobileMq);
      };
    }

    let raf = 0;
    let frame = 0;
    let lastDrawAt = 0;
    let lastWidth = 0;
    let lastHeight = 0;
    let noiseBuffers: ImageData[] = [];

    const createNoiseImage = (w: number, h: number, lowAlpha: boolean) => {
      const id = ctx.createImageData(w, h);
      const d = id.data;
      const alphaMin = lowAlpha ? 10 : 22;
      const alphaRange = lowAlpha ? 18 : 55;
      for (let i = 0; i < d.length; i += 4) {
        const g = Math.random() * 255;
        d[i] = g;
        d[i + 1] = g;
        d[i + 2] = g;
        d[i + 3] = alphaMin + Math.random() * alphaRange;
      }
      return id;
    };

    const rebuildNoiseBuffers = () => {
      const w = canvas.width;
      const h = canvas.height;
      if (w <= 0 || h <= 0) return;
      const lowAlpha = mobileRef.current;
      noiseBuffers = Array.from({ length: NOISE_BUFFER_COUNT }, () =>
        createNoiseImage(w, h, lowAlpha),
      );
      lastWidth = w;
      lastHeight = h;
    };

    const resize = () => {
      const scale = mobileRef.current ? 0.22 : SCALE;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.max(1, Math.floor(window.innerWidth * dpr * scale));
      const h = Math.max(1, Math.floor(window.innerHeight * dpr * scale));
      canvas.width = w;
      canvas.height = h;
      canvas.style.width = "100%";
      canvas.style.height = "100%";
      ctx.imageSmoothingEnabled = false;
      rebuildNoiseBuffers();
    };

    resize();
    window.addEventListener("resize", resize);

    const isTargetRoute = TARGET_PATHS.has(window.location.pathname);
    if (!isTargetRoute) {
      return () => {
        mq.removeEventListener("change", onMq);
        mobileMq.removeEventListener("change", onMobileMq);
        window.removeEventListener("resize", resize);
      };
    }

    const onScroll = () => {
      isScrollingRef.current = true;
      if (idleTimerRef.current) {
        window.clearTimeout(idleTimerRef.current);
      }
      idleTimerRef.current = window.setTimeout(() => {
        isScrollingRef.current = false;
      }, SCROLL_IDLE_MS);
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    const loop = (now: number) => {
      const w = canvas.width;
      const h = canvas.height;
      if (w !== lastWidth || h !== lastHeight || noiseBuffers.length === 0) {
        rebuildNoiseBuffers();
      }

      const isMobile = mobileRef.current;
      const isReduced = reducedRef.current;
      const targetFps = isReduced
        ? REDUCED_MOTION_FPS
        : isScrollingRef.current
          ? SCROLLING_FPS
          : isMobile
            ? MOBILE_FPS
            : DESKTOP_FPS;
      const minFrameMs = 1000 / Math.max(1, targetFps);
      if (now - lastDrawAt < minFrameMs) {
        raf = requestAnimationFrame(loop);
        return;
      }
      lastDrawAt = now;
      frame += 1;

      if (isReduced) {
        if (frame % 2 === 0) {
          rebuildNoiseBuffers();
        }
        const reducedFrame = noiseBuffers[frame % noiseBuffers.length];
        if (reducedFrame) {
          ctx.putImageData(reducedFrame, 0, 0);
        }
        raf = requestAnimationFrame(loop);
        return;
      }

      if (!isScrollingRef.current && frame % 6 === 0) {
        rebuildNoiseBuffers();
      }
      const source = noiseBuffers[frame % noiseBuffers.length];
      if (!source) {
        raf = requestAnimationFrame(loop);
        return;
      }

      const flickerBase = isMobile ? 0.93 : 0.88;
      const flickerAmp = isMobile ? 0.06 : 0.12;
      const flicker = flickerBase + Math.sin(frame * 0.08) * flickerAmp;
      ctx.globalAlpha = flicker;
      ctx.putImageData(source, 0, 0);
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);

    return () => {
      mq.removeEventListener("change", onMq);
      mobileMq.removeEventListener("change", onMobileMq);
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", onScroll);
      if (idleTimerRef.current) {
        window.clearTimeout(idleTimerRef.current);
      }
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-100 overflow-hidden" aria-hidden>
      {/* CSS: noise タイルをゆっくりパン（ざらつきの層） */}
      <div className="noise-tile-layer" />
      {/* Canvas: フレームごとの粒（ざらざら） */}
      <canvas
        ref={canvasRef}
        className="noise-canvas-layer absolute inset-0 h-full w-full [image-rendering:pixelated]"
      />
    </div>
  );
}
