import { useEffect, useRef } from "react";
import { animate, createScope, onScroll } from "animejs";

function Section({
  label,
  sectionRef,
  boxRef,
}: {
  label: string;
  sectionRef: (el: HTMLDivElement | null) => void;
  boxRef: (el: HTMLDivElement | null) => void;
}) {
  return (
    <div ref={sectionRef} className="section" style={styles.section}>
      <div ref={boxRef} className="box" style={styles.box}>
        {label}
      </div>
    </div>
  );
}

export default function AnimalsScrollLatest() {
  const rootRef = useRef<HTMLDivElement>(null);
  const scopeRef = useRef<ReturnType<typeof createScope> | null>(null);
  const sectionRefs = useRef<Array<HTMLDivElement | null>>([]);
  const boxRefs = useRef<Array<HTMLDivElement | null>>([]);
  const labels = ["🐱 Cat", "🐶 Dog", "🐦 Bird"];

  useEffect(() => {
    if (!rootRef.current || !sectionRefs.current || !boxRefs.current) return;

    scopeRef.current = createScope({ root: rootRef.current }).add(() => {
      sectionRefs.current.forEach((section, index) => {
        const target = boxRefs.current[index];
        if (!section || !target) return;

        animate(target, {
          translateY: [0, 100],
          scale: [0.1, 1],
          ease: "linear",
          autoplay: onScroll({
            // target: section,
            // enter: "top bottom",
            // leave: "bottom top",
            sync: true,
            debug: true,
            onUpdate: (self) => {
              const observer = self as { progress?: number };
              console.log("progress", observer.progress);
            },
          }),
        });
      });
    });

    return () => {
      scopeRef.current?.revert();
      scopeRef.current = null;
    };
  }, []);

  return (
    <div ref={rootRef}>
      {labels.map((label, index) => (
        <Section
          key={label}
          label={label}
          sectionRef={(el) => {
            sectionRefs.current[index] = el;
          }}
          boxRef={(el) => {
            boxRefs.current[index] = el;
          }}
        />
      ))}
    </div>
  );
}

const styles = {
  section: {
    height: "150vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#111",
    borderBottom: "1px solid #333",
  },
  box: {
    fontSize: "40px",
    color: "#fff",
    willChange: "transform, opacity",
  },
};
