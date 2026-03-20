import { useEffect, useRef } from "react";
import type { RefObject } from "react";

export function useSmoothPointer(containerRef: RefObject<HTMLElement | null>) {
  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    const onPointerMove = (event: PointerEvent) => {
      const rect = node.getBoundingClientRect();
      const nextX = (event.clientX - rect.left) / rect.width - 0.5;
      const nextY = (event.clientY - rect.top) / rect.height - 0.5;
      target.current = { x: nextX, y: nextY };
    };

    const animate = () => {
      current.current.x += (target.current.x - current.current.x) * 0.08;
      current.current.y += (target.current.y - current.current.y) * 0.08;

      node.style.setProperty("--pointer-x", `${current.current.x.toFixed(4)}`);
      node.style.setProperty("--pointer-y", `${current.current.y.toFixed(4)}`);
      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    node.addEventListener("pointermove", onPointerMove);

    return () => {
      node.removeEventListener("pointermove", onPointerMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [containerRef]);
}
