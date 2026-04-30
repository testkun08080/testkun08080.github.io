import styles from "../../pages/dev-contact/DevContact.module.css";

const CONTACT_ITEMS = [
  { label: "Email", value: "hello@example.com" },
  { label: "X", value: "@testkun08080" },
  { label: "Name", value: "testkun08080" },
] as const;

export function ContactCardSection() {
  return (
    <main className={styles.page}>
      <section
        className={styles.card}
        style={{
          background: "transparent",
          borderColor: "rgb(148 163 184 / 0.42)",
          color: "#1e293b",
        }}
      >
        <p className={styles.eyebrow} style={{ color: "#64748b" }}>
          CONTACT
        </p>
        <h2 className={styles.title} style={{ color: "#0f172a" }}>
          Get in touch
        </h2>
        <ul className={styles.list}>
          {CONTACT_ITEMS.map((item) => (
            <li
              key={item.label}
              className={styles.item}
              style={{
                background: "transparent",
                border: "1px solid rgb(148 163 184 / 0.3)",
              }}
            >
              <span className={styles.label} style={{ color: "#334155" }}>
                {item.label}
              </span>
              <span className={styles.value} style={{ color: "#0f172a" }}>
                {item.value}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
