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
      const isMobile = mobileRef.current;
      if (isMobile && frame % 2 === 1) {
        raf = requestAnimationFrame(loop);
        return;
      }

      const flickerBase = isMobile ? 0.93 : 0.85;
      const flickerAmp = isMobile ? 0.07 : 0.15;
      const flicker = flickerBase + Math.sin(frame * 0.08) * flickerAmp;
      const alphaMin = isMobile ? 10 : 22;
      const alphaRange = isMobile ? 18 : 55;
      for (let i = 0; i < d.length; i += 4) {
        const g = Math.random() * 255;
        d[i] = g;
        d[i + 1] = g;
        d[i + 2] = g;
        d[i + 3] = (alphaMin + Math.random() * alphaRange) * flicker;
      }
      ctx.putImageData(id, 0, 0);
      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);

    return () => {
      mq.removeEventListener("change", onMq);
      mobileMq.removeEventListener("change", onMobileMq);
      window.removeEventListener("resize", resize);
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
