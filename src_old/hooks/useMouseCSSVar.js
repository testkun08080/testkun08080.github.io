import { useEffect, useRef } from "react";

export function useMouseCSSVar() {
  const x = useRef(0);
  const y = useRef(0);
  const targetX = useRef(0);
  const targetY = useRef(0);

  useEffect(() => {
    const handleMove = (e) => {
      targetX.current = e.clientX;
      targetY.current = e.clientY;
    };

    const update = () => {
      x.current += (targetX.current - x.current) * 0.15; // ← ドットにディレイをかける
      y.current += (targetY.current - y.current) * 0.15;
      document.body.style.setProperty("--x", `${x.current}px`);
      document.body.style.setProperty("--y", `${y.current}px`);
      requestAnimationFrame(update);
    };

    document.addEventListener("mousemove", handleMove);
    update();
    return () => document.removeEventListener("mousemove", handleMove);
  }, []);
}