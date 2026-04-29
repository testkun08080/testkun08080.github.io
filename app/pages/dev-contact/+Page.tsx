import styles from "./DevContact.module.css";

const CONTACT_ITEMS = [
  { label: "メアド", value: "hello@example.com" },
  { label: "X", value: "@testkun08080" },
  { label: "名前", value: "testkun08080" },
] as const;

export default function Page() {
  return (
    <main className={styles.page}>
      <section className={styles.card}>
        <p className={styles.eyebrow}>CONTACT</p>
        <h1 className={styles.title}>連絡先</h1>
        <ul className={styles.list}>
          {CONTACT_ITEMS.map((item) => (
            <li key={item.label} className={styles.item}>
              <span className={styles.label}>{item.label}</span>
              <span className={styles.value}>{item.value}</span>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
