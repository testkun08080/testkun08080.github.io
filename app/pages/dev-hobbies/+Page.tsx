import { useEffect } from "react";
import { createDraggable } from "animejs";
import styles from "./DevHobbies.module.css";

type HobbyItem = {
  id: string;
  title: string;
  icon: string;
  face: string;
};

const HOBBIES: HobbyItem[] = [
  {
    id: "camera",
    title: "Camera (Film / Digital)",
    icon: "📷",
    face: "( •̀ᴗ•́ )و",
  },
  { id: "sauna", title: "SOUNA", icon: "♨️", face: "( ´ ▽ ` )ﾉ" },
  { id: "cooking", title: "Cooking", icon: "🍳", face: "(๑´ڡ`๑)" },
  { id: "movies", title: "Watching movies", icon: "🎬", face: "( ͡° ͜ʖ ͡°)" },
  { id: "walk", title: "Walking around town", icon: "🚶", face: "(ง •̀_•́)ง" },
];

export default function Page() {
  useEffect(() => {
    const cards = document.querySelectorAll<HTMLElement>(".hobby-card");
    const area = document.querySelector<HTMLElement>(`#${styles.grid}`);
    cards.forEach((card) => {
      createDraggable(card, {
        // x: true,
        container: area,
        // releaseEase: "outElastic",
        x: { mapTo: "rotateY" },
        y: { mapTo: "z" },
      });
    });
  }, []);

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
          <article key={hobby.id} className={`${styles.card} hobby-card`}>
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
