import { useEffect } from "react";
import Lenis from "lenis";

export function useGlobalEffects() {
  useEffect(() => {
    const lenis = new Lenis();

    let rafId = 0;
    let x = window.innerWidth * 0.5;
    let y = window.innerHeight * 0.5;
    let tx = x;
    let ty = y;

    const onMove = (event: MouseEvent) => {
      tx = event.clientX;
      ty = event.clientY;
    };

    const animate = (time: number) => {
      lenis.raf(time);
      
      x += (tx - x) * 0.14;
      y += (ty - y) * 0.14;
      document.body.style.setProperty("--fx-x", `${x}px`);
      document.body.style.setProperty("--fx-y", `${y}px`);
      rafId = window.requestAnimationFrame(animate);
    };

    const onClick = (event: MouseEvent) => {
      const ripple = document.createElement("span");
      ripple.className = "fx-ripple";
      ripple.style.left = `${event.clientX}px`;
      ripple.style.top = `${event.clientY}px`;
      document.body.appendChild(ripple);
      window.setTimeout(() => ripple.remove(), 680);

      document.body.classList.add("fx-sandstorm");
      window.setTimeout(() => document.body.classList.remove("fx-sandstorm"), 260);
    };

    document.addEventListener("mousemove", onMove);
    document.addEventListener("click", onClick);
    rafId = window.requestAnimationFrame(animate);

    return () => {
      window.cancelAnimationFrame(rafId);
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("click", onClick);
      lenis.destroy();
    };
  }, []);
}
