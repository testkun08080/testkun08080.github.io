import { type CSSProperties } from "react";

type CurtainStyles = Record<string, string>;

type HalfSide = "left" | "right";

export type CurtainMarqueeProps = {
  styles: CurtainStyles;
  lineCount: number;
  lineText: string;
  rootClassName?: string;
  getHalfStyle?: (i: number, lineCount: number, side: HalfSide) => CSSProperties;
  onLeftHalfRef?: (i: number, el: HTMLDivElement | null) => void;
  onRightHalfRef?: (i: number, el: HTMLDivElement | null) => void;
};

const MARQUEE_BASE_DURATION_S = 124;
const MARQUEE_OFFSET_FACTOR = 7;
const MARQUEE_OFFSET_CYCLE = 6;
const MARQUEE_OFFSET_STEP_S = 8;

export function CurtainMarquee({
  styles,
  lineCount,
  lineText,
  rootClassName,
  getHalfStyle,
  onLeftHalfRef,
  onRightHalfRef,
}: CurtainMarqueeProps) {
  const hasMarquee = !!(
    styles.marqueeTrack &&
    styles.marqueeLeft &&
    styles.marqueeRight
  );

  return (
    <div
      className={rootClassName ? `${styles.curtain} ${rootClassName}` : styles.curtain}
      aria-hidden="true"
    >
      {Array.from({ length: lineCount }, (_, i) => {
        const lineClass = i % 2 === 0 ? styles.curtainLine : styles.curtainLineAlt;
        const durationSec =
          MARQUEE_BASE_DURATION_S +
          ((i * MARQUEE_OFFSET_FACTOR) % MARQUEE_OFFSET_CYCLE) *
            MARQUEE_OFFSET_STEP_S;
        const marqueeStyle = {
          ["--marquee-duration" as string]: `${durationSec}s`,
        } as CSSProperties;

        const leftStyle = getHalfStyle?.(i, lineCount, "left");
        const rightStyle = getHalfStyle?.(i, lineCount, "right");

        return (
          <div key={i} className={styles.row}>
            <div
              className={`${styles.half} ${styles.halfLeft}`}
              ref={(el) => onLeftHalfRef?.(i, el)}
              style={leftStyle}
            >
              <div className={styles.halfClip}>
                {hasMarquee ? (
                  <div
                    className={
                      i % 2 === 0
                        ? `${styles.marqueeTrack} ${styles.marqueeLeft}`
                        : `${styles.marqueeTrack} ${styles.marqueeRight}`
                    }
                    style={marqueeStyle}
                  >
                    <p className={lineClass} aria-hidden>
                      {lineText}
                    </p>
                    <p className={lineClass} aria-hidden>
                      {lineText}
                    </p>
                  </div>
                ) : (
                  <p className={lineClass} aria-hidden>
                    {lineText}
                  </p>
                )}
              </div>
            </div>
            <div
              className={`${styles.half} ${styles.halfRight}`}
              ref={(el) => onRightHalfRef?.(i, el)}
              style={rightStyle}
            >
              <div className={styles.halfClip}>
                {hasMarquee ? (
                  <div
                    className={
                      i % 2 === 0
                        ? `${styles.marqueeTrack} ${styles.marqueeRight}`
                        : `${styles.marqueeTrack} ${styles.marqueeLeft}`
                    }
                    style={marqueeStyle}
                  >
                    <p className={lineClass} aria-hidden>
                      {lineText}
                    </p>
                    <p className={lineClass} aria-hidden>
                      {lineText}
                    </p>
                  </div>
                ) : (
                  <p className={lineClass} aria-hidden>
                    {lineText}
                  </p>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
