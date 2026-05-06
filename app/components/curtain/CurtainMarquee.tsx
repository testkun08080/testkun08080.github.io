import { type CSSProperties } from "react";

type CurtainStyles = Record<string, string>;

type HalfSide = "left" | "right";

export type CurtainMarqueeProps = {
  styles: CurtainStyles;
  lineCount: number;
  lineText: string;
  getHalfStyle?: (i: number, lineCount: number, side: HalfSide) => CSSProperties;
  onLeftHalfRef?: (i: number, el: HTMLDivElement | null) => void;
  onRightHalfRef?: (i: number, el: HTMLDivElement | null) => void;
};

export function CurtainMarquee({
  styles,
  lineCount,
  lineText,
  getHalfStyle,
  onLeftHalfRef,
  onRightHalfRef,
}: CurtainMarqueeProps) {
  const hasMarquee =
    Boolean(styles.marqueeTrack) &&
    Boolean(styles.marqueeLeft) &&
    Boolean(styles.marqueeRight);

  return (
    <div className={styles.curtain} aria-hidden="true">
      {Array.from({ length: lineCount }, (_, i) => {
        const lineClass = i % 2 === 0 ? styles.curtainLine : styles.curtainLineAlt;
        const durationSec = 124 + ((i * 7) % 6) * 8;
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
