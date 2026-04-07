import { useEffect, useRef } from "react";

const SCALE = 0.28;

/**
 * 低解像度 Canvas で毎フレーム更新するグレイン + noise.png タイルの微細な揺らぎ。
 * app の NoiseCanvas / Layout の grain を参考に、動きを足した版。
 */
export function AnimatedNoise() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reducedRef = useRef(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    reducedRef.current = mq.matches;
    const onMq = () => {
      reducedRef.current = mq.matches;
    };
    mq.addEventListener("change", onMq);

    const canvas = canvasRef.current;
    if (!canvas) return () => mq.removeEventListener("change", onMq);

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return () => mq.removeEventListener("change", onMq);

    let raf = 0;
    let frame = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.max(1, Math.floor(window.innerWidth * dpr * SCALE));
      const h = Math.max(1, Math.floor(window.innerHeight * dpr * SCALE));
      canvas.width = w;
      canvas.height = h;
      canvas.style.width = "100%";
      canvas.style.height = "100%";
      ctx.imageSmoothingEnabled = false;
    };

    resize();
    window.addEventListener("resize", resize);

    const loop = () => {
      frame++;
      const w = canvas.width;
      const h = canvas.height;

      if (reducedRef.current) {
        if (frame % 120 === 0) {
          const id = ctx.createImageData(w, h);
          const d = id.data;
          for (let i = 0; i < d.length; i += 4) {
            const g = Math.random() * 255;
            d[i] = g;
            d[i + 1] = g;
            d[i + 2] = g;
            d[i + 3] = 28;
          }
          ctx.putImageData(id, 0, 0);
        }
        raf = requestAnimationFrame(loop);
        return;
      }

      const id = ctx.createImageData(w, h);
      const d = id.data;
      const flicker = 0.85 + Math.sin(frame * 0.08) * 0.15;
      for (let i = 0; i < d.length; i += 4) {
        const g = Math.random() * 255;
        d[i] = g;
        d[i + 1] = g;
        d[i + 2] = g;
        d[i + 3] = (22 + Math.random() * 55) * flicker;
      }
      ctx.putImageData(id, 0, 0);
      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);

    return () => {
      mq.removeEventListener("change", onMq);
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(raf);
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
