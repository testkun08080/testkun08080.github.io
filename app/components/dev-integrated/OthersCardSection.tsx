import { animate, createScope, onScroll } from "animejs";
import { useEffect, useRef } from "react";
import { animateFadeSlideReveal } from "../../lib/scrollRunOnce";
import styles from "../shared-dev-assets/DevContact.module.css";

type OthersCardSectionProps = {
  blogLabel: string;
  blogUrl: string;
  blogHref: string;
};

export function OthersCardSection({
  blogLabel,
  blogUrl,
  blogHref,
}: OthersCardSectionProps) {
  const rootRef = useRef<HTMLElement>(null);
  const scopeRef = useRef<ReturnType<typeof createScope> | null>(null);

  useEffect(() => {
    if (!rootRef.current) return;

    const root = rootRef.current;

    scopeRef.current = createScope({ root: rootRef.current }).add(() => {
      animateFadeSlideReveal(animate, onScroll, root, {
        enter: "bottom top",
        leave: "center center",
      });
    });

    return () => {
      scopeRef.current?.revert();
      scopeRef.current = null;
    };
  }, []);

  return (
    <section ref={rootRef} className={styles.card}>
      <ul className={styles.list}>
        <li className={styles.item}>
          <div className={styles.itemMeta}>
            <span className={styles.label}>{blogLabel}</span>
          </div>
          <a
            className={styles.valueLink}
            href={blogHref}
            target="_blank"
            rel="noreferrer noopener"
          >
            {blogUrl}
          </a>
        </li>
      </ul>
    </section>
  );
}
