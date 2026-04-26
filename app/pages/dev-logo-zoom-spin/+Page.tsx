import {
  type MotionValue,
  motion,
  useMotionValueEvent,
  useMotionTemplate,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { useId, useRef, useState } from "react";
import styles from "./DevLogoZoomSpin.module.css";

type ScrollLogoLayerConfig = {
  rotateFrom: number;
  rotateTo: number;
  opacityIn: [number, number];
  opacityTo: number;
  x: number;
  y: number;
  scale: number;
};

// Edit this array to tune how many logos appear while scrolling,
// how much they overlap (x/y/scale), and how much each one rotates.
const SCROLL_LOGO_LAYERS: ScrollLogoLayerConfig[] = [
  {
    rotateFrom: -8,
    rotateTo: 32,
    opacityIn: [0.08, 0.36],
    opacityTo: 0.62,
    x: -8,
    y: -10,
    scale: 0.995,
  },
  {
    rotateFrom: 12,
    rotateTo: 58,
    opacityIn: [0.16, 0.48],
    opacityTo: 0.56,
    x: 10,
    y: 6,
    scale: 1.005,
  },
  {
    rotateFrom: -18,
    rotateTo: 84,
    opacityIn: [0.24, 0.58],
    opacityTo: 0.48,
    x: 16,
    y: -14,
    scale: 1.015,
  },
];

// Tunable spiral path that starts from center and expands outward.
const SPIRAL_PATH_D =
  "M500 500 C505 498 510 501 511 507 C512 518 501 526 489 525 C471 522 460 503 464 484 C472 455 503 438 534 445 C574 456 596 498 586 541 C570 595 512 629 456 617 C390 600 353 531 369 463 C392 373 486 324 577 347 C684 374 742 487 716 596 C678 721 550 788 422 754 C280 717 201 569 233 425 C279 258 453 166 622 208 C812 255 917 452 873 643 C810 856 592 972 376 926 C141 860 12 619 64 382 C138 122 406 -20 668 51 C953 129 1110 420 1040 708";

const PEEK_WINDOW_PATH_D =
  "M500 188 C602 150 718 179 776 256 C835 336 832 446 770 520 C731 567 688 593 680 641 C673 687 696 744 674 790 C648 844 579 872 506 872 C429 872 352 840 328 774 C307 717 333 650 315 604 C293 547 241 523 210 470 C165 394 169 291 228 227 C287 165 395 140 500 188 Z";

function OverlayLogoLayer({
  scrollYProgress,
  config,
}: {
  scrollYProgress: MotionValue<number>;
  config: ScrollLogoLayerConfig;
}) {
  const layerOpacity = useTransform(
    scrollYProgress,
    [config.opacityIn[0], config.opacityIn[1]],
    [0, config.opacityTo],
  );
  const layerRotate = useTransform(
    scrollYProgress,
    [0, 0.62],
    [config.rotateFrom, config.rotateTo],
  );

  return (
    <motion.img
      src="/logo-trans.svg"
      alt=""
      aria-hidden
      className={`${styles.logoImage} ${styles.logoLayerSub}`}
      draggable={false}
      style={{
        opacity: layerOpacity,
        rotate: layerRotate,
        x: config.x,
        y: config.y,
        scale: config.scale,
      }}
    />
  );
}

export default function Page() {
  const stageRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion() ?? false;
  const [hasScrollStarted, setHasScrollStarted] = useState(false);
  const clipPathId = `peek-window-${useId().replace(/:/g, "")}`;

  const { scrollYProgress } = useScroll({
    target: stageRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (latest > 0.001) {
      setHasScrollStarted(true);
    }
  });

  const logoScale = useTransform(scrollYProgress, [0, 0.62], [1, 9]);
  const logoRotate = useTransform(scrollYProgress, [0, 0.62], [0, 240]);
  const logoOpacity = useTransform(scrollYProgress, [0.32, 0.74], [1, 0]);
  const spiralPathLength = useTransform(scrollYProgress, [0.06, 0.56], [0, 1]);
  const spiralInkOpacity = useTransform(
    scrollYProgress,
    [0.03, 0.2, 0.6, 0.78],
    [0, 0.98, 0.86, 0],
  );
  const spiralStrokeWidth = useTransform(scrollYProgress, [0.06, 0.72], [3.5, 28]);
  const peekWindowScale = useTransform(scrollYProgress, [0.12, 0.72], [0.28, 1.24]);
  const peekWindowRotate = useTransform(scrollYProgress, [0.12, 0.72], [-22, 6]);
  const peekLayerOpacity = useTransform(scrollYProgress, [0.08, 0.7], [0.22, 1]);
  const peekPanelOpacity = useTransform(scrollYProgress, [0, 0.88], [0.9, 0.08]);
  const peekPanelBlur = useTransform(scrollYProgress, [0.3, 0.9], [0, 7]);
  const peekPanelFilter = useMotionTemplate`blur(${peekPanelBlur}px)`;

  const nextOpacity = useTransform(scrollYProgress, [0.5, 0.9], [0, 1]);
  const nextY = useTransform(scrollYProgress, [0.5, 0.9], [44, 0]);

  return (
    <main className={styles.page}>
      <section className={styles.intro}>
        <h1 className={styles.title}>dev-logo-zoom-spin</h1>
        <p className={styles.copy}>
          中央ロゴがスクロールで拡大・回転しながら消え、次の内容が見えてくる。
        </p>
      </section>

      <section ref={stageRef} className={styles.stage}>
        <div className={styles.stickyFrame}>
          <motion.div
            className={styles.peekBackdropPanel}
            style={
              reduceMotion
                ? undefined
                : {
                    opacity: peekPanelOpacity,
                    filter: peekPanelFilter,
                  }
            }
          />
          <motion.div
            className={styles.peekLayer}
            style={reduceMotion ? undefined : { opacity: peekLayerOpacity }}
            aria-hidden
          >
            <svg
              className={styles.peekSvg}
              viewBox="0 0 1000 1000"
              preserveAspectRatio="xMidYMid slice"
            >
              <defs>
                <clipPath id={clipPathId} clipPathUnits="userSpaceOnUse">
                  <motion.g
                    style={
                      reduceMotion
                        ? undefined
                        : {
                            scale: peekWindowScale,
                            rotate: peekWindowRotate,
                            transformBox: "fill-box",
                            transformOrigin: "50% 50%",
                          }
                    }
                  >
                    <path d={PEEK_WINDOW_PATH_D} />
                  </motion.g>
                </clipPath>
              </defs>

              <g clipPath={`url(#${clipPathId})`}>
                <foreignObject x="0" y="0" width="1000" height="1000">
                  <div className={styles.peekContent}>
                    <p className={styles.peekKicker}>NEXT PAGE PREVIEW</p>
                    <h2 className={styles.peekTitle}>SVG path window scroll reveal</h2>
                    <p className={styles.peekCopy}>
                      スクロール量に合わせて窓の形が拡大し、次のセクションが一部ずつ見えていきます。
                    </p>
                  </div>
                </foreignObject>
              </g>
            </svg>
          </motion.div>

          <motion.div
            className={styles.logoWrap}
            style={
              reduceMotion
                ? undefined
                : {
                    scale: logoScale,
                    rotate: logoRotate,
                    opacity: logoOpacity,
                  }
            }
          >
            {reduceMotion ? null : (
              <div className={styles.spiralOverlay} aria-hidden>
                <svg
                  className={styles.spiralSvg}
                  viewBox="0 0 1000 1000"
                  preserveAspectRatio="xMidYMid meet"
                >
                  <motion.path
                    d={SPIRAL_PATH_D}
                    className={styles.spiralPath}
                    style={{
                      pathLength: spiralPathLength,
                      strokeWidth: spiralStrokeWidth,
                      opacity: spiralInkOpacity,
                    }}
                  />
                </svg>
              </div>
            )}
            <div
              className={`${styles.logoFrame} ${
                reduceMotion || hasScrollStarted ? "" : styles.idleFloat
              }`}
            >
              {reduceMotion
                ? null
                : SCROLL_LOGO_LAYERS.map((config, index) => (
                    <OverlayLogoLayer
                      key={`overlay-logo-layer-${index}`}
                      scrollYProgress={scrollYProgress}
                      config={config}
                    />
                  ))}
              <img
                src="/logo.svg"
                alt="testkun logo"
                className={`${styles.logoImage} ${styles.logoLayerMain}`}
                draggable={false}
              />
            </div>
          </motion.div>

          <motion.section
            className={styles.nextSection}
            style={
              reduceMotion
                ? undefined
                : {
                    opacity: nextOpacity,
                    y: nextY,
                  }
            }
          >
            <h2 className={styles.nextTitle}>Next Chapter</h2>
            <p className={styles.nextCopy}>
              ロゴ演出の後ろにある次セクションです。スクロールが進むと前面に現れます。
            </p>
          </motion.section>
        </div>
      </section>
    </main>
  );
}
