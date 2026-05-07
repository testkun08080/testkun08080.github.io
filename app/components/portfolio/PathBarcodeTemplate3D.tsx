import { animate, createTimeline, stagger } from "animejs";
import { useEffect, useMemo, useRef } from "react";

const DEFAULT_BARCODE_UNIT = "*0123456789ABCDEF*";

type Props = {
  paused: boolean;
  className?: string;
  viewBox?: string;
  pathD?: string;
  textUnit?: string;
  textRepeat?: number;
  flowDurationMs?: number;
  flipDurationMs?: number;
};

function toViewBoxNumbers(viewBox: string): [number, number, number, number] {
  const parts = viewBox
    .trim()
    .split(/\s+/)
    .map((n) => Number.parseFloat(n));
  if (parts.length !== 4 || parts.some((n) => Number.isNaN(n))) {
    return [0, 0, 100, 100];
  }
  return [parts[0], parts[1], parts[2], parts[3]];
}

export function PathBarcodeTemplate3D({
  paused,
  className,
  viewBox = "0 0 100 100",
  pathD = "",
  textUnit = DEFAULT_BARCODE_UNIT,
  textRepeat = 8,
  flowDurationMs = 9000,
  flipDurationMs = 680,
}: Props) {
  const [vbX, vbY, vbW, vbH] = toViewBoxNumbers(viewBox);
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const itemsLayerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const charRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const topRefs = useRef<Array<HTMLElement | null>>([]);
  const frontRefs = useRef<Array<HTMLElement | null>>([]);
  const bottomRefs = useRef<Array<HTMLElement | null>>([]);
  const chars = useMemo(
    () => Array.from(textUnit.repeat(textRepeat)),
    [textUnit, textRepeat],
  );
  const play = !paused;

  useEffect(() => {
    const svg = svgRef.current;
    const path = pathRef.current;
    const itemsLayer = itemsLayerRef.current;
    if (!svg || !path || !itemsLayer) return;

    // Drop stale refs when text length changes across breakpoints/resizes.
    itemRefs.current = itemRefs.current.slice(0, chars.length);
    charRefs.current = charRefs.current.slice(0, chars.length);
    topRefs.current = topRefs.current.slice(0, chars.length);
    frontRefs.current = frontRefs.current.slice(0, chars.length);
    bottomRefs.current = bottomRefs.current.slice(0, chars.length);

    const items = itemRefs.current.filter(
      (el): el is HTMLSpanElement => el !== null,
    );
    if (items.length === 0) return;

    const pathLen = path.getTotalLength();
    const spacing = pathLen / items.length;
    const state = { offset: 0 };
    const sampleCount = Math.max(256, items.length * 8);
    const sampleSpacing = pathLen / sampleCount;
    const points = Array.from({ length: sampleCount }, (_, i) =>
      path.getPointAtLength(i * sampleSpacing),
    );
    const tangents = points.map((p, i) => {
      const n = points[(i + 1) % sampleCount];
      return { x: n.x - p.x, y: n.y - p.y };
    });

    const sampleAtDistance = (distance: number) => {
      const normalized = ((distance % pathLen) + pathLen) % pathLen;
      const index = normalized / sampleSpacing;
      const i0 = Math.floor(index) % sampleCount;
      const i1 = (i0 + 1) % sampleCount;
      const t = index - Math.floor(index);
      const p0 = points[i0];
      const p1 = points[i1];
      const tx = tangents[i0].x + (tangents[i1].x - tangents[i0].x) * t;
      const ty = tangents[i0].y + (tangents[i1].y - tangents[i0].y) * t;
      return {
        x: p0.x + (p1.x - p0.x) * t,
        y: p0.y + (p1.y - p0.y) * t,
        angle: (Math.atan2(ty, tx) * 180) / Math.PI,
      };
    };

    const placeItems = () => {
      const bounds = itemsLayer.getBoundingClientRect();
      const scaleX = bounds.width / (vbW || 1);
      const scaleY = bounds.height / (vbH || 1);
      for (let i = 0; i < items.length; i += 1) {
        const d = (i * spacing + state.offset + pathLen) % pathLen;
        const sampled = sampleAtDistance(d);
        const x = (sampled.x - vbX) * scaleX;
        const y = (sampled.y - vbY) * scaleY;
        items[i].style.transform =
          `translate(${x}px, ${y}px) rotate(${sampled.angle}deg)`;
      }
    };

    placeItems();

    const resizeObserver = new ResizeObserver(() => {
      placeItems();
    });
    resizeObserver.observe(itemsLayer);

    let flowAnim: ReturnType<typeof animate> | null = null;
    let tl: ReturnType<typeof createTimeline> | null = null;

    if (play) {
      flowAnim = animate(state, {
        offset: [0, -pathLen],
        duration: flowDurationMs,
        ease: "linear",
        loop: true,
        onUpdate: placeItems,
      });

      const charEls = charRefs.current.filter(
        (el): el is HTMLSpanElement => el !== null,
      );
      const topEls = topRefs.current.filter(
        (el): el is HTMLElement => el !== null,
      );
      const frontEls = frontRefs.current.filter(
        (el): el is HTMLElement => el !== null,
      );
      const bottomEls = bottomRefs.current.filter(
        (el): el is HTMLElement => el !== null,
      );

      const charsStagger = stagger(60, { start: 0 });
      tl = createTimeline({
        defaults: {
          ease: "linear",
          loop: true,
          duration: flipDurationMs,
        },
      });

      tl.add(charEls, { rotateX: -90 }, charsStagger)
        .add(topEls, { opacity: [0.5, 0] }, charsStagger)
        .add(frontEls, { opacity: [1, 0.5] }, charsStagger)
        .add(bottomEls, { opacity: [0.5, 1] }, charsStagger);
    }

    return () => {
      resizeObserver.disconnect();
      flowAnim?.revert();
      tl?.revert();
    };
  }, [
    chars.length,
    pathD,
    play,
    vbX,
    vbY,
    vbW,
    vbH,
    flowDurationMs,
    flipDurationMs,
  ]);

  return (
    <div className={`hero-barcode-template3d ${className ?? ""}`.trim()}>
      <svg
        ref={svgRef}
        viewBox={viewBox}
        className="hero-barcode-template3d-svg"
        preserveAspectRatio="none"
        aria-hidden
      >
        <path
          ref={pathRef}
          d={pathD}
          fill="none"
          className="hero-barcode-template3d-path"
        />
      </svg>
      <div
        ref={itemsLayerRef}
        className="hero-barcode-template3d-items"
        aria-label="3D barcode on path"
      >
        {chars.map((char, i) => (
          <span
            key={`hero-barcode-3d-${i}`}
            ref={(el) => {
              itemRefs.current[i] = el;
            }}
            className="hero-barcode-template3d-item"
          >
            <span
              ref={(el) => {
                charRefs.current[i] = el;
              }}
              className="hero-barcode-template3d-char"
            >
              <em
                ref={(el) => {
                  topRefs.current[i] = el;
                }}
                className="hero-barcode-template3d-face hero-barcode-template3d-face-top"
              >
                {char}
              </em>
              <em
                ref={(el) => {
                  frontRefs.current[i] = el;
                }}
                className="hero-barcode-template3d-face hero-barcode-template3d-face-front"
              >
                {char}
              </em>
              <em
                ref={(el) => {
                  bottomRefs.current[i] = el;
                }}
                className="hero-barcode-template3d-face hero-barcode-template3d-face-bottom"
              >
                {char}
              </em>
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
