// src/hooks/useClickEffects.js
import { useEffect } from "react";

export function useClickEffects() {
  useEffect(() => {
    const handleClick = (e) => {
      // 波紋
      const ripple = document.createElement("span");
      ripple.className = "ripple";
      ripple.style.left = `${e.clientX}px`;
      ripple.style.top = `${e.clientY}px`;
      document.body.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);

      // 画面揺れ
      document.body.classList.add("shake");
      setTimeout(() => document.body.classList.remove("shake"), 300);
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);
}