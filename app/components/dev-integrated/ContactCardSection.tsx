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
          borderColor: "var(--color-border-strong)",
          color: "var(--color-text-body)",
        }}
      >
        <p className={styles.eyebrow} style={{ color: "var(--color-text-subtitle)" }}>
          CONTACT
        </p>
        <h2 className={styles.title} style={{ color: "var(--color-text-heading)" }}>
          Get in touch
        </h2>
        <ul className={styles.list}>
          {CONTACT_ITEMS.map((item) => (
            <li
              key={item.label}
              className={styles.item}
              style={{
                background: "transparent",
                border: "1px solid var(--color-border-subtle)",
              }}
            >
              <span className={styles.label} style={{ color: "var(--color-text-body)" }}>
                {item.label}
              </span>
              <span className={styles.value} style={{ color: "var(--color-text-heading)" }}>
                {item.value}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
