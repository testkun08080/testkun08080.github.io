import { useEffect, useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll, useTransform } from "motion/react";
import { animated, useSpring } from "@react-spring/web";
import logoUrl from "../../images/logo.svg";

import styles from "./IntroSunabaReveal.module.css";

function applyScrollPhase(
  latest: number,
  setIntroEnded: (v: boolean) => void,
) {
  if (!Number.isFinite(latest)) return;
  setIntroEnded(latest > 0.48);
}

/** Scroll distance = sceneHeight - 100vh. 200vh → exactly 1 viewport of scroll for progress 0→1. */
export function IntroSunabaReveal() {
  const sceneRef = useRef<HTMLElement>(null);
  const [introEnded, setIntroEnded] = useState(false);

  const { scrollYProgress } = useScroll({
    target: sceneRef,
    offset: ["start start", "end end"],
  });

  // Tighter ranges: logo fully gone before sunaba is solid; smaller max scale = no huge faint halo
  const logoScale = useTransform(scrollYProgress, [0, 0.38], [1, 4.2]);
  const logoRotate = useTransform(scrollYProgress, [0, 0.38], [0, 180]);
  const logoOpacity = useTransform(scrollYProgress, [0, 0.34], [1, 0]);
  const logoFilter = useTransform(scrollYProgress, [0, 0.34], ["blur(0px)", "blur(20px)"]);

  const floatSpring = useSpring({
    from: { y: 0 },
    to: { y: -10 },
    loop: { reverse: true },
    config: { tension: 120, friction: 20 },
  });

  // Sync after layout: "change" may not fire for the initial value
  useEffect(() => {
    const id = requestAnimationFrame(() => {
      applyScrollPhase(scrollYProgress.get(), setIntroEnded);
    });
    return () => cancelAnimationFrame(id);
  }, [scrollYProgress]);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    applyScrollPhase(latest, setIntroEnded);
  });

  return (
    <section ref={sceneRef} className={styles.scene}>
      <div className={styles.sticky}>
        <motion.div
          className={styles.introLayer}
          style={{ opacity: logoOpacity, filter: logoFilter }}
          aria-hidden
        >
          <motion.div style={{ scale: logoScale, rotate: logoRotate }}>
            <animated.img
              src={logoUrl}
              alt=""
              className={styles.logo}
              style={{ transform: floatSpring.y.to((y) => `translate3d(0, ${y}px, 0)`) }}
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
