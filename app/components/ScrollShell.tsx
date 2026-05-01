import type { ReactNode } from "react";
import { AnimatedNoise } from "./AnimatedNoise";

type Props = {
  children: ReactNode;
};

export function ScrollShell({ children }: Props) {
  return (
    <>
      <AnimatedNoise />
      {children}
    </>
  );
}
