import { useRef, type PointerEvent as ReactPointerEvent } from "react";
import styles from "./DevHobbies.module.css";

type HobbyItem = {
  id: string;
  title: string;
  icon: string;
  face: string;
};

const HOBBIES: HobbyItem[] = [
  { id: "camera", title: "Camera (Film / Digital)", icon: "📷", face: "( •̀ᴗ•́ )و" },
  { id: "sauna", title: "SOUNA", icon: "♨️", face: "( ´ ▽ ` )ﾉ" },
  { id: "cooking", title: "Cooking", icon: "🍳", face: "(๑´ڡ`๑)" },
  { id: "movies", title: "Watching movies", icon: "🎬", face: "( ͡° ͜ʖ ͡°)" },
  { id: "walk", title: "Walking around town", icon: "🚶", face: "(ง •̀_•́)ง" },
];

type DragState = {
  pointerId: number;
  startX: number;
  startY: number;
  offsetX: number;
  offsetY: number;
};

const MAX_DRAG = 24;

function clampMove(value: number) {
  return Math.max(-MAX_DRAG, Math.min(MAX_DRAG, value));
}

export default function Page() {
  const dragMapRef = useRef(new Map<string, DragState>());

  const handlePointerDown = (id: string) => (event: ReactPointerEvent<HTMLElement>) => {
    const target = event.currentTarget;
    target.setPointerCapture(event.pointerId);
    target.style.transition = "transform 0s";
    dragMapRef.current.set(id, {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      offsetX: 0,
      offsetY: 0,
    });
  };

  const handlePointerMove = (id: string) => (event: ReactPointerEvent<HTMLElement>) => {
    const state = dragMapRef.current.get(id);
    if (!state || state.pointerId !== event.pointerId) return;

    const moveX = clampMove(event.clientX - state.startX);
    const moveY = clampMove(event.clientY - state.startY);
    state.offsetX = moveX;
    state.offsetY = moveY;
    event.currentTarget.style.transform = `translate3d(${moveX}px, ${moveY}px, 0) rotate(${moveX * 0.22}deg)`;
  };

  const resetCard = (id: string, target: HTMLElement, pointerId: number) => {
    const state = dragMapRef.current.get(id);
    if (!state || state.pointerId !== pointerId) return;
    dragMapRef.current.delete(id);
    target.style.transition = "transform 260ms cubic-bezier(0.2, 0.9, 0.2, 1)";
    target.style.transform = "translate3d(0, 0, 0) rotate(0deg)";
  };

  const handlePointerUp = (id: string) => (event: ReactPointerEvent<HTMLElement>) => {
    resetCard(id, event.currentTarget, event.pointerId);
  };

  const handlePointerCancel = (id: string) => (event: ReactPointerEvent<HTMLElement>) => {
    resetCard(id, event.currentTarget, event.pointerId);
  };

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>dev-hobbies</h1>
        <p className={styles.copy}>
          絵文字＋顔文字で趣味を表現。カードはタッチ/ドラッグで少しだけ動かせます。
        </p>
      </header>

      <section className={styles.grid} aria-label="hobbies">
        {HOBBIES.map((hobby) => (
          <article
            key={hobby.id}
            className={styles.card}
            onPointerDown={handlePointerDown(hobby.id)}
            onPointerMove={handlePointerMove(hobby.id)}
            onPointerUp={handlePointerUp(hobby.id)}
            onPointerCancel={handlePointerCancel(hobby.id)}
          >
            <p className={styles.icon} aria-hidden="true">
              {hobby.icon}
            </p>
            <p className={styles.name}>{hobby.title}</p>
            <p className={styles.face}>{hobby.face}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
