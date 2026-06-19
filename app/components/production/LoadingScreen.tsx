import { useEffect, useState } from "react";
import styles from "./LoadingScreen.module.css";

type Props = {
  visible: boolean;
};

export function LoadingScreen({ visible }: Props) {
  const [gone, setGone] = useState(false);

  useEffect(() => {
    if (gone) return;

    const html = document.documentElement;
    const body = document.body;
    const prev = {
      htmlOverflow: html.style.overflow,
      bodyOverflow: body.style.overflow,
      htmlOverscroll: html.style.overscrollBehavior,
      bodyOverscroll: body.style.overscrollBehavior,
      bodyPosition: body.style.position,
      bodyTop: body.style.top,
      bodyLeft: body.style.left,
      bodyRight: body.style.right,
      bodyWidth: body.style.width,
    };

    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    html.style.overscrollBehavior = "none";
    body.style.overscrollBehavior = "none";
    body.style.position = "fixed";
    body.style.top = "0";
    body.style.left = "0";
    body.style.right = "0";
    body.style.width = "100%";

    const scrollKeys = new Set([
      "ArrowUp",
      "ArrowDown",
      "ArrowLeft",
      "ArrowRight",
      "PageUp",
      "PageDown",
      "Home",
      "End",
      " ",
    ]);

    const preventScrollGesture = (event: Event) => {
      event.preventDefault();
    };

    const preventScrollKeys = (event: KeyboardEvent) => {
      const target = event.target;
      if (target instanceof HTMLElement) {
        const tag = target.tagName;
        if (
          tag === "INPUT" ||
          tag === "TEXTAREA" ||
          tag === "SELECT" ||
          target.isContentEditable
        ) {
          return;
        }
      }
      if (scrollKeys.has(event.key)) {
        event.preventDefault();
      }
    };

    const resetScroll = () => {
      if (window.scrollY !== 0 || window.scrollX !== 0) {
        window.scrollTo(0, 0);
      }
    };

    const gestureOptions: AddEventListenerOptions = {
      capture: true,
      passive: false,
    };

    window.addEventListener("wheel", preventScrollGesture, gestureOptions);
    window.addEventListener("touchmove", preventScrollGesture, gestureOptions);
    document.addEventListener("wheel", preventScrollGesture, gestureOptions);
    document.addEventListener("touchmove", preventScrollGesture, gestureOptions);
    window.addEventListener("keydown", preventScrollKeys, { capture: true });
    window.addEventListener("scroll", resetScroll, { capture: true, passive: true });

    return () => {
      window.removeEventListener("wheel", preventScrollGesture, gestureOptions);
      window.removeEventListener("touchmove", preventScrollGesture, gestureOptions);
      document.removeEventListener("wheel", preventScrollGesture, gestureOptions);
      document.removeEventListener(
        "touchmove",
        preventScrollGesture,
        gestureOptions,
      );
      window.removeEventListener("keydown", preventScrollKeys, { capture: true });
      window.removeEventListener("scroll", resetScroll, { capture: true });

      html.style.overflow = prev.htmlOverflow;
      body.style.overflow = prev.bodyOverflow;
      html.style.overscrollBehavior = prev.htmlOverscroll;
      body.style.overscrollBehavior = prev.bodyOverscroll;
      body.style.position = prev.bodyPosition;
      body.style.top = prev.bodyTop;
      body.style.left = prev.bodyLeft;
      body.style.right = prev.bodyRight;
      body.style.width = prev.bodyWidth;

      window.scrollTo(0, 0);
    };
  }, [gone]);

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
        <img src="/logo.png" className={styles.logo} alt="" />
        <div className={styles.bar} />
      </div>
    </div>
  );
}
