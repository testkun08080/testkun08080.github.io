import type { ReactNode } from "react";
import { ReactLenis } from "lenis/react";
import "lenis/dist/lenis.css";
import { AnimatedNoise } from "./AnimatedNoise";

type Props = {
  children: ReactNode;
};

export function ScrollShell({ children }: Props) {
  return (
    <ReactLenis
      root
      options={{
        duration: 1.15,
        smoothWheel: true,
        touchMultiplier: 1.15,
        easing: (t) => (t === 1 ? 1 : 1 - 2 ** (-10 * t)),
      }}
    >
      <AnimatedNoise />
      {children}
    </ReactLenis>
  );
}
