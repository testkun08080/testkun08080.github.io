import { animate } from "animejs";
import { useId, useLayoutEffect, useRef, type RefObject } from "react";

const DEFAULT_TEXT_UNIT = "*0123456789ABCDEF*ANIMEJS*DEV-LOOP*";

type Props = {
  paused: boolean;
  className?: string;
  viewBox?: string;
  pathD?: string;
  showGuidePath?: boolean;
  stroke?: string;
  strokeWidth?: number;
  strokeLinejoin?: "miter" | "round" | "bevel";
  textUnit?: string;
  textRepeat?: number;
  durationMs?: number;
};

function useStartOffsetLoop<T extends SVGTextPathElement>(
  ref: RefObject<T | null>,
  offsetPct: readonly [number, number],
  durationMs: number,
  play: boolean,
  seekToMs?: number,
) {
  useLayoutEffect(() => {
    const tp = ref.current;
    if (!tp || !play) return;

    const state = { offsetPct: offsetPct[0] };
    tp.setAttribute("startOffset", `${offsetPct[0]}%`);

    const anim = animate(state, {
      offsetPct: [offsetPct[0], offsetPct[1]],
      duration: durationMs,
      ease: "linear",
      loop: true,
      onUpdate: () => {
        tp.setAttribute("startOffset", `${state.offsetPct}%`);
      },
    });

    if (seekToMs !== undefined && seekToMs > 0) {
      anim.seek(seekToMs);
    }

    return () => {
      anim.revert();
      tp.setAttribute("startOffset", `${offsetPct[0]}%`);
    };
  }, [ref, offsetPct, durationMs, play, seekToMs]);
}

export function PathTextOnRect({
  paused,
  className,
  viewBox = "0 0 100 100",
  pathD = "M 2 2 L 98 2 L 98 98 L 2 98 Z",
  showGuidePath = true,
  stroke = "#7f1d1d",
  strokeWidth = 0.7,
  strokeLinejoin = "round",
  textUnit = DEFAULT_TEXT_UNIT,
  textRepeat = 20,
  durationMs = 8000,
}: Props) {
  const rawId = useId();
  const pathId = `path-text-rect-${rawId.replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const oddTextPathRef = useRef<SVGTextPathElement>(null);
  const evenTextPathRef = useRef<SVGTextPathElement>(null);
  const play = !paused;

  useStartOffsetLoop(
    oddTextPathRef,
    [-100, 100],
    durationMs,
    play,
    durationMs / 2,
  );
  useStartOffsetLoop(evenTextPathRef, [-200, 0], durationMs, play);

  const textLoop = `${textUnit.repeat(textRepeat)}${textUnit.repeat(textRepeat)}`;

  return (
    <svg
      viewBox={viewBox}
      className="absolute inset-0 h-full w-full"
      preserveAspectRatio="none"
      aria-hidden
    >
      <defs>
        <path id={pathId} d={pathD} />
      </defs>
      {showGuidePath ? (
        <use
          href={`#${pathId}`}
          fill="none"
          stroke={stroke}
          strokeWidth={strokeWidth}
          strokeLinejoin={strokeLinejoin}
        />
      ) : null}
      <text className={className}>
        <textPath ref={oddTextPathRef} href={`#${pathId}`} startOffset="100%">
          {textLoop}
        </textPath>
      </text>
      <text className={className}>
        <textPath ref={evenTextPathRef} href={`#${pathId}`} startOffset="0%">
          {textLoop}
        </textPath>
      </text>
    </svg>
  );
}
