import {
  motion,
  useMotionTemplate,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { useId, useRef } from "react";
import styles from "./DevSvgPathPeek.module.css";

const WINDOW_PATH_D =
  "M500 170 C620 128 752 165 815 256 C879 350 868 474 789 554 C741 603 684 633 673 691 C662 747 692 816 651 863 C603 918 512 935 420 910 C336 887 267 831 254 756 C242 687 286 630 263 573 C237 510 168 483 138 423 C95 339 116 232 188 171 C266 104 393 95 500 170 Z";

export default function Page() {
  const stageRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion() ?? false;
  const clipPathId = `svg-path-peek-${useId().replace(/:/g, "")}`;

  const { scrollYProgress } = useScroll({
    target: stageRef,
    offset: ["start start", "end end"],
  });

  const windowScale = useTransform(scrollYProgress, [0.05, 0.78], [0.18, 1.36]);
  const windowRotate = useTransform(scrollYProgress, [0.05, 0.78], [-18, 4]);
  const nextLayerOpacity = useTransform(scrollYProgress, [0.04, 0.72], [0.35, 1]);
  const introOpacity = useTransform(scrollYProgress, [0.28, 0.82], [1, 0.08]);
  const introBlur = useTransform(scrollYProgress, [0.36, 0.9], [0, 8]);
  const introFilter = useMotionTemplate`blur(${introBlur}px)`;

  return (
    <main className={styles.page}>
      <section ref={stageRef} className={styles.stage}>
        <div className={styles.stickyFrame}>
          <motion.section
            className={styles.introLayer}
            style={
              reduceMotion
                ? undefined
                : {
                    opacity: introOpacity,
                    filter: introFilter,
                  }
            }
          >
            <p className={styles.panelKicker}>SECTION A</p>
            <h2 className={styles.panelTitle}>Scroll Down</h2>
            <p className={styles.panelCopy}>
              スクロールに合わせて、SVG パス窓から次のセクションが見えます。
            </p>
          </motion.section>

          <motion.div
            className={styles.nextLayer}
            style={reduceMotion ? undefined : { opacity: nextLayerOpacity }}
            aria-hidden
          >
            <svg
              className={styles.windowSvg}
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
                            scale: windowScale,
                            rotate: windowRotate,
                            transformBox: "fill-box",
                            transformOrigin: "50% 50%",
                          }
                    }
                  >
                    <path d={WINDOW_PATH_D} />
                  </motion.g>
                </clipPath>
              </defs>

              <g clipPath={`url(#${clipPathId})`}>
                <foreignObject x="0" y="0" width="1000" height="1000">
                  <div className={styles.nextContent}>
                    <p className={styles.nextKicker}>SECTION B</p>
                    <h3 className={styles.nextTitle}>Revealed Through SVG Path</h3>
                    <p className={styles.nextCopy}>
                      スクロール進捗と連動して、窓が段階的に拡大します。
                    </p>
                  </div>
                </foreignObject>
              </g>
            </svg>
          </motion.div>
        </div>
      </section>

      <section className={styles.endSection}>
        <h2 className={styles.endTitle}>Section B</h2>
        <p className={styles.endCopy}>ここから通常スクロールの次セクションです。</p>
      </section>
    </main>
  );
}
