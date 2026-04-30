import styles from "../shared-dev-assets/DevContact.module.css";

type ContactItem = {
  label: string;
  value: string;
  href?: string;
};

const CONTACT_ITEMS = [
  {
    label: "Email",
    value: "testkun.08080@gmail.com",
    href: "mailto:testkun.08080@gmail.com",
  },
  {
    label: "X",
    value: "@testkun08080",
    href: "https://x.com/testkun08080",
  },
  {
    label: "GitHub",
    value: "github.com/testkun08080",
    href: "https://github.com/testkun08080",
  },
] satisfies ContactItem[];

export function ContactCardSection() {
  return (
    <section className={styles.card}>
      <div className={styles.cardHeader}>
        <p className={styles.eyebrow}>OPEN TO WORK</p>
        <h3 className={styles.title}>Let&apos;s build something great.</h3>
      </div>

      <ul className={styles.list}>
        {CONTACT_ITEMS.map((item) => (
          <li key={item.label} className={styles.item}>
            <div className={styles.itemMeta}>
              <span className={styles.label}>{item.label}</span>
            </div>
            {item.href ? (
              <a
                className={styles.valueLink}
                href={item.href}
                target={item.href.startsWith("http") ? "_blank" : undefined}
                rel={
                  item.href.startsWith("http")
                    ? "noreferrer noopener"
                    : undefined
                }
              >
                {item.value}
              </a>
            ) : (
              <span className={styles.value}>{item.value}</span>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
