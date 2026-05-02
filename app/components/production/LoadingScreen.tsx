import { useState } from "react";
import styles from "./LoadingScreen.module.css";

type Props = {
  visible: boolean;
};

export function LoadingScreen({ visible }: Props) {
  const [gone, setGone] = useState(false);

  const onTransitionEnd = (e: React.TransitionEvent<HTMLDivElement>) => {
    if (!visible && e.propertyName === "opacity") {
      setGone(true);
    }
  };

  if (gone) return null;

  return (
    <div
      className={`${styles.overlay} ${!visible ? styles.hiding : ""}`}
      onTransitionEnd={onTransitionEnd}
      aria-hidden="true"
    >
      <div className={styles.inner}>
        <img src="/logo.svg" className={styles.logo} alt="" />
        <div className={styles.bar} />
      </div>
    </div>
  );
}
