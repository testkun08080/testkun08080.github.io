import {
  motion,
  useMotionTemplate,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { useRef } from "react";
import styles from "./DevLogoCenterReveal.module.css";

export default function Page() {
  const stageRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion() ?? false;

  const { scrollYProgress } = useScroll({
    target: stageRef,
    offset: ["start start", "end end"],
  });

  const logoScale = useTransform(scrollYProgress, [0, 0.62], [1, 8.6]);
  const logoRotate = useTransform(scrollYProgress, [0, 0.62], [0, 220]);
  const logoOpacity = useTransform(scrollYProgress, [0.3, 0.76], [1, 0]);

  const revealRadius = useTransform(scrollYProgress, [0.08, 0.74], [24, 980]);
  const revealClipPath = useMotionTemplate`circle(${revealRadius}px at 50% 50%)`;
  const revealOpacity = useTransform(scrollYProgress, [0.06, 0.3], [0.35, 1]);

  return (
    <main className={styles.page}>
      <section className={styles.intro}>
        <h1 className={styles.title}>dev-logo-center-reveal</h1>
        <p className={styles.copy}>
          中央ロゴだけを軸にスクロール演出。ロゴがズームインして回転し、次のセクションが前に現れます。
        </p>
      </section>

      <section ref={stageRef} className={styles.stage}>
        <div className={styles.stickyFrame}>
          <motion.section
            className={styles.revealViewport}
            style={
              reduceMotion
                ? undefined
                : {
                    clipPath: revealClipPath,
                    opacity: revealOpacity,
                  }
            }
          >
            <div className={styles.revealContent}>
              <p className={styles.revealKicker}>NEXT CONTENT</p>
              <h2 className={styles.revealTitle}>Logo Center Window Reveal</h2>
              <p className={styles.revealCopy}>
                ロゴ中央の円窓からだけ次のページが見え、スクロールに合わせて円が拡張して全体が見えるようになります。
              </p>
            </div>
          </motion.section>

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
            <img
              src="/logo.svg"
              alt="testkun logo"
              className={styles.logoImage}
              draggable={false}
            />
          </motion.div>
        </div>
      </section>
    </main>
  );
}
