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

    // パス上の点を細かいテーブルにキャッシュ。フレーム内では lookup のみで O(1)
    const SAMPLES = Math.max(256, items.length * 8);
    const sampleX = new Float32Array(SAMPLES);
    const sampleY = new Float32Array(SAMPLES);
    const sampleAngle = new Float32Array(SAMPLES);
    const buildSamples = () => {
      for (let i = 0; i < SAMPLES; i += 1) {
        const d = (i / SAMPLES) * pathLen;
        const p = path.getPointAtLength(d);
        const n = path.getPointAtLength((d + 2) % pathLen);
        sampleX[i] = p.x;
        sampleY[i] = p.y;
        sampleAngle[i] = (Math.atan2(n.y - p.y, n.x - p.x) * 180) / Math.PI;
      }
    };
    buildSamples();

    const placeItems = () => {
      const bounds = itemsLayer.getBoundingClientRect();
      const scaleX = bounds.width / (vbW || 1);
      const scaleY = bounds.height / (vbH || 1);
      for (let i = 0; i < items.length; i += 1) {
        const d = (i * spacing + state.offset + pathLen) % pathLen;
        const idx = ((d / pathLen) * SAMPLES) | 0;
        const px = sampleX[idx];
        const py = sampleY[idx];
        const angle = sampleAngle[idx];
        const x = (px - vbX) * scaleX;
        const y = (py - vbY) * scaleY;
        items[i].style.transform =
          `translate(${x}px, ${y}px) rotate(${angle}deg)`;
      }
    };

    placeItems();

    const resizeObserver = new ResizeObserver(() => {
      placeItems();
    });
    resizeObserver.observe(itemsLayer);

    let flowAnim: ReturnType<typeof animate> | null = null;
    let tl: ReturnType<typeof createTimeline> | null = null;

    const isMobile =
      typeof window !== "undefined" &&
      window.matchMedia("(max-width: 768px)").matches;

    if (play) {
      flowAnim = animate(state, {
        offset: [0, -pathLen],
        duration: flowDurationMs,
        ease: "linear",
        loop: true,
        onUpdate: placeItems,
      });

      // mobile では 3D flip を省略（負荷大かつ視認性も低い）
      if (!isMobile) {
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
    }

    // 画面外では flow / flip を停止して負荷をゼロに
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            flowAnim?.play();
            tl?.play();
          } else {
            flowAnim?.pause();
            tl?.pause();
          }
        }
      },
      { threshold: 0 },
    );
    io.observe(itemsLayer);

    return () => {
      io.disconnect();
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
