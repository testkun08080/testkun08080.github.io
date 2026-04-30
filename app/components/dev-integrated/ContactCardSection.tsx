import styles from "../../pages/dev-contact/DevContact.module.css";

type ContactItem = {
  label: string;
  value: string;
  note: string;
  href?: string;
};

const CONTACT_ITEMS = [
  {
    label: "Email",
    value: "hello@example.com",
    href: "mailto:hello@example.com",
    note: "返信は通常24時間以内",
  },
  {
    label: "X",
    value: "@testkun08080",
    href: "https://x.com/testkun08080",
    note: "制作ログや技術メモを更新",
  },
  { label: "Name", value: "testkun08080", note: "Shoichi Hasegawa" },
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
              <span className={styles.note}>{item.note}</span>
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
