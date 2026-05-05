import {
  cloneElement,
  isValidElement,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactElement,
  type ReactNode,
} from "react";
import {
  clamp01,
  easeOutCubic,
  rowCloseLocal,
  rowOpenLocal,
} from "../../lib/barcodeTextBridgeMath";
import { productionHomeCopy } from "../../lib/translations";
import type { Language } from "../../lib/translations";
import { usePrefersReducedMotion } from "../../lib/usePrefersReducedMotion";
import burstStyles from "../shared-dev-assets/DevBurstOverlayAnime.module.css";
import { GreetingBurstSection } from "./GreetingBurstSection";
import type { HeroBurstLogoSectionProps } from "./HeroBurstLogoSection";
import bridgeStyles from "./GreetingWithBarcodeBridge.module.css";

const CURTAIN_REPEAT = 15;
const INITIAL_CURTAIN_LINES = 16;

type Props = {
  language: Language;
  /** 指定時は sticky 内の背面（100dvh）に表示し、カーテン・挨拶レイヤーと重ねる（dev-integrated ヒーロー用） */
  hero?: ReactNode;
};

export function GreetingWithBarcodeBridge({ language, hero }: Props) {
  const reduceMotion = usePrefersReducedMotion();
  const copy = productionHomeCopy[language];
  const curtainLineText = Array.from(
    { length: CURTAIN_REPEAT },
    () => copy.greetingBgRowText,
  ).join(" ");

  const rootRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const heroUnderlayRef = useRef<HTMLDivElement>(null);
  const measureCurtainRef = useRef<HTMLParagraphElement>(null);
  const leftRefs = useRef<Array<HTMLDivElement | null>>([]);
  const rightRefs = useRef<Array<HTMLDivElement | null>>([]);
  const rafRef = useRef(0);
  const bridgeScrollProgressRef = useRef(0);

  const [curtainLineCount, setCurtainLineCount] = useState(
    INITIAL_CURTAIN_LINES,
  );

  useEffect(() => {
    const measure = measureCurtainRef.current;
    if (!measure) return;

    const updateCount = () => {
      const rowHeight = measure.getBoundingClientRect().height;
      if (rowHeight <= 0) return;
      const isMobile = window.matchMedia("(max-width: 640px)").matches;
      const minRows = isMobile ? 10 : 12;
      const maxRows = isMobile ? 32 : 40;
      const buffer = isMobile ? 1 : 2;
      const viewportHeight = window.innerHeight;
      const desired = Math.ceil(viewportHeight / rowHeight) + buffer;
      const nextCount = Math.min(maxRows, Math.max(minRows, desired));
      setCurtainLineCount((prev) => (prev === nextCount ? prev : nextCount));
    };

    let rafId = 0;
    const schedule = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(updateCount);
    };

    schedule();
    window.addEventListener("resize", schedule, { passive: true });
    window.addEventListener("orientationchange", schedule, { passive: true });

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("orientationchange", schedule);
    };
  }, []);

  useEffect(() => {
    if (reduceMotion) return;

    const track = trackRef.current;
    if (!track) return;

    const update = () => {
      const scrollY = window.scrollY;
      const trackTop = track.getBoundingClientRect().top + scrollY;
      const range = track.offsetHeight - window.innerHeight;
      const p = range > 0 ? clamp01((scrollY - trackTop) / range) : 0;
      bridgeScrollProgressRef.current = p;

      // ヒーローはカーテンが閉じきる p=0.5 までに 0 へフェード。
      // カーテンと同じ RAF でセットすることで、フェードと幕引きの拍を完全に揃える。
      const heroOpacity = clamp01(1 - p / 0.5);
      const heroEl = heroUnderlayRef.current;
      if (heroEl) {
        heroEl.style.setProperty("--hero-opacity", heroOpacity.toFixed(3));
        // 完全に消えたあとはレンダリング負荷を切り、後段のレイアウト/合成から外す
        heroEl.style.visibility = heroOpacity <= 0.001 ? "hidden" : "visible";
      }

      const n = curtainLineCount;

      if (p < 0.5) {
        const t = p / 0.5;
        for (let i = 0; i < n; i += 1) {
          const left = leftRefs.current[i];
          const right = rightRefs.current[i];
          if (!left || !right) continue;
          const lp = easeOutCubic(rowCloseLocal(t, i, n));
          left.style.transform = `translate3d(${-105 + lp * 105}%, 0, 0)`;
          right.style.transform = `translate3d(${105 - lp * 105}%, 0, 0)`;
        }
      } else {
        const t = (p - 0.5) / 0.5;
        for (let i = 0; i < n; i += 1) {
          const left = leftRefs.current[i];
          const right = rightRefs.current[i];
          if (!left || !right) continue;
          const lp = easeOutCubic(rowOpenLocal(t, i, n));
          left.style.transform = `translate3d(${-lp * 105}%, 0, 0)`;
          right.style.transform = `translate3d(${lp * 105}%, 0, 0)`;
        }
      }
    };

    const onScroll = () => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(rafRef.current);
    };
  }, [curtainLineCount, reduceMotion]);

  if (reduceMotion) {
    return (
      <>
        {hero ? (
          <section id="hero" className={bridgeStyles.reduceHero}>
            {hero}
          </section>
        ) : null}
        <section id="greeting">
          <GreetingBurstSection
            frontWord={copy.greetingFrontWord}
            bgRowText={copy.greetingBgRowText}
          />
        </section>
      </>
    );
  }

  return (
    <section
      ref={rootRef}
      id="greeting"
      className={burstStyles.page}
      aria-label="Greeting"
    >
      <div ref={trackRef} className={bridgeStyles.bridgeTrack}>
        <div className={bridgeStyles.stickyPin}>
          {hero ? (
            <div
              ref={heroUnderlayRef}
              id="hero"
              className={bridgeStyles.heroUnderlay}
            >
              {hero && isValidElement(hero)
                ? cloneElement(
                    hero as ReactElement<HeroBurstLogoSectionProps>,
                    {
                      bridgeScrollProgressRef,
                    },
                  )
                : hero}
            </div>
          ) : null}
          <section
            className={`${burstStyles.stage} ${bridgeStyles.stageStack}`}
          >
            <GreetingBurstSection
              frontWord={copy.greetingFrontWord}
              bgRowText={copy.greetingBgRowText}
              animationsEnabled={false}
              hideBgRows
              bridgeScrollProgressRef={bridgeScrollProgressRef}
              bridgeTypingRevealStart={0.3}
              bridgeTypingRevealEnd={0.5}
            />

            <div className={bridgeStyles.curtain} aria-hidden="true">
              <p
                ref={measureCurtainRef}
                className={`${bridgeStyles.curtainLine} ${bridgeStyles.measureRow}`}
                aria-hidden
              >
                {copy.greetingBgRowText}
              </p>
              {Array.from({ length: curtainLineCount }, (_, i) => {
                const lineClass =
                  i % 2 === 0
                    ? bridgeStyles.curtainLine
                    : bridgeStyles.curtainLineAlt;
                const base = bridgeStyles.marqueeTrack;
                const trackLeft =
                  i % 2 === 0
                    ? `${base} ${bridgeStyles.marqueeLeft}`
                    : `${base} ${bridgeStyles.marqueeRight}`;
                const trackRight =
                  i % 2 === 0
                    ? `${base} ${bridgeStyles.marqueeRight}`
                    : `${base} ${bridgeStyles.marqueeLeft}`;
                const durationSec = 22 + (i % 3) * 6;
                const marqueeStyle = {
                  ["--marquee-duration" as string]: `${durationSec}s`,
                } as CSSProperties;
                return (
                  <div key={`curtain-${i}`} className={bridgeStyles.row}>
                    <div
                      ref={(el) => {
                        leftRefs.current[i] = el;
                      }}
                      className={bridgeStyles.half}
                    >
                      <div className={bridgeStyles.halfClip}>
                        <div className={trackLeft} style={marqueeStyle}>
                          <p className={lineClass} aria-hidden>
                            {curtainLineText}
                          </p>
                          <p className={lineClass} aria-hidden>
                            {curtainLineText}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div
                      ref={(el) => {
                        rightRefs.current[i] = el;
                      }}
                      className={bridgeStyles.half}
                    >
                      <div className={bridgeStyles.halfClip}>
                        <div className={trackRight} style={marqueeStyle}>
                          <p className={lineClass} aria-hidden>
                            {curtainLineText}
                          </p>
                          <p className={lineClass} aria-hidden>
                            {curtainLineText}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </div>
    </section>
  );
}
