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
import { subscribeWindowRaf } from "../../lib/windowRafDriver";
import { productionHomeCopy } from "../../lib/translations";
import type { Language } from "../../lib/translations";
import { usePrefersReducedMotion } from "../../lib/usePrefersReducedMotion";
import burstStyles from "../shared-dev-assets/DevBurstOverlayAnime.module.css";
import {
  getHeroCurtainCloseEnd,
  isMobileBridgeViewport,
  P_CURTAIN_OPEN_END,
} from "./bridgeScrollPhases";
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
  const leftXRef = useRef<number[]>([]);
  const rightXRef = useRef<number[]>([]);
  const heroOpacityRef = useRef(1);
  const heroVisibleRef = useRef(true);
  const rafRef = useRef(0);
  const bridgeScrollProgressRef = useRef(0);

  const [curtainLineCount, setCurtainLineCount] = useState(
    INITIAL_CURTAIN_LINES,
  );

  const p2 = P_CURTAIN_OPEN_END;

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

      const p1 = getHeroCurtainCloseEnd(isMobileBridgeViewport());
      const heroOpacity = clamp01(1 - p / p1);
      const heroEl = heroUnderlayRef.current;
      if (heroEl) {
        const nextHeroOpacity = Math.round(heroOpacity * 1000) / 1000;
        if (heroOpacityRef.current !== nextHeroOpacity) {
          heroOpacityRef.current = nextHeroOpacity;
          heroEl.style.setProperty("--hero-opacity", nextHeroOpacity.toFixed(3));
        }
        const nextVisible = nextHeroOpacity > 0.001;
        if (heroVisibleRef.current !== nextVisible) {
          heroVisibleRef.current = nextVisible;
          heroEl.style.visibility = nextVisible ? "visible" : "hidden";
        }
      }

      const n = curtainLineCount;

      if (p < p1) {
        const t = p / p1;
        for (let i = 0; i < n; i += 1) {
          const left = leftRefs.current[i];
          const right = rightRefs.current[i];
          if (!left || !right) continue;
          const lp = easeOutCubic(rowCloseLocal(t, i, n));
          const nextLeftX = Math.round((-105 + lp * 105) * 1000) / 1000;
          const nextRightX = Math.round((105 - lp * 105) * 1000) / 1000;
          if (leftXRef.current[i] !== nextLeftX) {
            leftXRef.current[i] = nextLeftX;
            left.style.transform = `translate3d(${nextLeftX}%, 0, 0)`;
          }
          if (rightXRef.current[i] !== nextRightX) {
            rightXRef.current[i] = nextRightX;
            right.style.transform = `translate3d(${nextRightX}%, 0, 0)`;
          }
        }
      } else if (p < p2) {
        const span = p2 - p1;
        const t = span > 1e-6 ? (p - p1) / span : 1;
        for (let i = 0; i < n; i += 1) {
          const left = leftRefs.current[i];
          const right = rightRefs.current[i];
          if (!left || !right) continue;
          const lp = easeOutCubic(rowOpenLocal(t, i, n));
          const nextLeftX = Math.round((-lp * 105) * 1000) / 1000;
          const nextRightX = Math.round((lp * 105) * 1000) / 1000;
          if (leftXRef.current[i] !== nextLeftX) {
            leftXRef.current[i] = nextLeftX;
            left.style.transform = `translate3d(${nextLeftX}%, 0, 0)`;
          }
          if (rightXRef.current[i] !== nextRightX) {
            rightXRef.current[i] = nextRightX;
            right.style.transform = `translate3d(${nextRightX}%, 0, 0)`;
          }
        }
      } else {
        for (let i = 0; i < n; i += 1) {
          const left = leftRefs.current[i];
          const right = rightRefs.current[i];
          if (!left || !right) continue;
          if (leftXRef.current[i] !== -105) {
            leftXRef.current[i] = -105;
            left.style.transform = "translate3d(-105%, 0, 0)";
          }
          if (rightXRef.current[i] !== 105) {
            rightXRef.current[i] = 105;
            right.style.transform = "translate3d(105%, 0, 0)";
          }
        }
      }
    };

    const scheduleUpdate = () => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(update);
    };

    update();
    const unsubscribe = subscribeWindowRaf(scheduleUpdate, {
      scroll: true,
      resize: true,
    });

    return () => {
      unsubscribe();
      cancelAnimationFrame(rafRef.current);
      leftXRef.current = [];
      rightXRef.current = [];
      heroOpacityRef.current = 1;
      heroVisibleRef.current = true;
    };
  }, [curtainLineCount, reduceMotion, p1, p2]);

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
              bridgeTypingRevealStart={p1}
              bridgeTypingRevealEnd={p2}
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
