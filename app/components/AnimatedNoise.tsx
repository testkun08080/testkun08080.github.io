import { useEffect, useRef } from "react";

const SCALE = 0.28;

/**
 * 低解像度 Canvas で毎フレーム更新するグレイン + noise.png タイルの微細な揺らぎ。
 * app の NoiseCanvas / Layout の grain を参考に、動きを足した版。
 */
export function AnimatedNoise() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reducedRef = useRef(false);
  const mobileRef = useRef(false);

  useEffect(() => {
    const motionMq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mobileMq = window.matchMedia("(max-width: 768px), (pointer: coarse)");
    reducedRef.current = motionMq.matches;
    mobileRef.current = mobileMq.matches;
    const onMotion = () => {
      reducedRef.current = motionMq.matches;
    };
    const onMobile = () => {
      mobileRef.current = mobileMq.matches;
    };
    motionMq.addEventListener("change", onMotion);
    mobileMq.addEventListener("change", onMobile);

    const canvas = canvasRef.current;
    const cleanup = () => {
      motionMq.removeEventListener("change", onMotion);
      mobileMq.removeEventListener("change", onMobile);
    };
    if (!canvas) return cleanup;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return cleanup;

    let raf = 0;
    let frame = 0;
    let imageData: ImageData | null = null;
    let buf32: Uint32Array | null = null;

    const ensureBuffer = (w: number, h: number) => {
      if (!imageData || imageData.width !== w || imageData.height !== h) {
        imageData = ctx.createImageData(w, h);
        buf32 = new Uint32Array(imageData.data.buffer);
      }
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      // mobile はさらに解像度を抑えて GPU/CPU 負荷を下げる
      const scale = mobileRef.current ? SCALE * 0.6 : SCALE;
      const w = Math.max(1, Math.floor(window.innerWidth * dpr * scale));
      const h = Math.max(1, Math.floor(window.innerHeight * dpr * scale));
      canvas.width = w;
      canvas.height = h;
      canvas.style.width = "100%";
      canvas.style.height = "100%";
      ctx.imageSmoothingEnabled = false;
      ensureBuffer(w, h);
    };

    resize();
    let resizeTimer = 0;
    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(resize, 150);
    };
    window.addEventListener("resize", onResize);

    const fillNoise = (alphaBase: number, alphaJitter: number) => {
      if (!buf32 || !imageData) return;
      const len = buf32.length;
      // ABGR (little-endian) で 1 ピクセル 1 書き込み
      for (let i = 0; i < len; i++) {
        const g = (Math.random() * 256) | 0;
        const a = (alphaBase + Math.random() * alphaJitter) | 0;
        buf32[i] = (a << 24) | (g << 16) | (g << 8) | g;
      }
      ctx.putImageData(imageData, 0, 0);
    };

    const loop = () => {
      frame++;

      if (reducedRef.current) {
        if (frame % 120 === 0) fillNoise(28, 0);
        raf = requestAnimationFrame(loop);
        return;
      }

      // mobile はフレーム間引き（~20fps 相当）で常時 RAF コストを抑える
      if (mobileRef.current && frame % 3 !== 0) {
        raf = requestAnimationFrame(loop);
        return;
      }

      const flicker = 0.85 + Math.sin(frame * 0.08) * 0.15;
      fillNoise(22 * flicker, 55 * flicker);
      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);

    const handleVisibility = () => {
      if (document.hidden) {
        if (raf) cancelAnimationFrame(raf);
        raf = 0;
      } else if (!raf) {
        raf = requestAnimationFrame(loop);
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      cleanup();
      window.removeEventListener("resize", onResize);
      window.clearTimeout(resizeTimer);
      document.removeEventListener("visibilitychange", handleVisibility);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-[100] overflow-hidden" aria-hidden>
      {/* CSS: noise タイルをゆっくりパン（ざらつきの層） */}
      <div className="noise-tile-layer" />
      {/* Canvas: フレームごとの粒（ざらざら） */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full opacity-[0.14] mix-blend-overlay [image-rendering:pixelated]"
      />
    </div>
  );
}
