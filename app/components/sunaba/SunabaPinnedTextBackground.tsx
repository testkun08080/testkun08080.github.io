import { animate } from "animejs";
import { useEffect, useMemo, useRef } from "react";
import { SUNABA_PINNED_PHRASES } from "../../lib/sunabaPinnedPhrases";
import { buildPinnedTextPlacements } from "../../lib/sunabaLayout";
import { usePrefersReducedMotion } from "../../lib/usePrefersReducedMotion";
import styles from "./SunabaPinnedTextBackground.module.css";

type Props = {
  count?: number;
};

export function SunabaPinnedTextBackground({ count = 32 }: Props) {
  const reducedMotion = usePrefersReducedMotion();
  const layerRef = useRef<HTMLDivElement>(null);
  const placements = useMemo(
    () => buildPinnedTextPlacements(SUNABA_PINNED_PHRASES, count),
    [count],
  );

  useEffect(() => {
    if (reducedMotion || !layerRef.current) return;
    const nodes = layerRef.current.querySelectorAll<HTMLElement>(`[data-pinned]`);
    if (!nodes.length) return;

    const animations = Array.from(nodes).map((node, i) =>
      animate(node, {
        opacity: {
          from: 0,
          to: Number(node.dataset.opacity) || 0.2,
        },
        duration: 900,
        delay: i * 28,
        ease: "out(2)",
      }),
    );

    return () => {
      animations.forEach((anim) => anim.pause());
    };
  }, [reducedMotion, placements]);

  return (
    <div className={styles.layer} aria-hidden="true" ref={layerRef}>
      {placements.map((item) => (
        <span
          key={item.id}
          data-pinned
          data-opacity={item.opacity}
          className={[
            styles.pinned,
            reducedMotion ? undefined : styles.hidden,
          ]
            .filter(Boolean)
            .join(" ")}
          style={{
            left: `${item.left}%`,
            top: `${item.top}%`,
            transform: `translate(-50%, -50%) rotate(${item.rotate}deg)`,
            fontSize: `clamp(0.72rem, ${item.fontSize}vw, 1.35rem)`,
            opacity: reducedMotion ? item.opacity : undefined,
          }}
        >
          {item.text}
        </span>
      ))}
    </div>
  );
}

