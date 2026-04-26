import { animate, stagger } from "animejs";
import { useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";
import styles from "./DevSoftwareTools.module.css";

const ICONS = [
  { name: "React", file: "lang_react.svg", folder: "plang-icons" },
  { name: "OpenGL", file: "lang_opengl.svg", folder: "plang-icons" },
  { name: "Maya Language", file: "lang_maya.svg", folder: "plang-icons" },
  { name: "HLSL", file: "lang_hlsl.svg", folder: "plang-icons" },
  { name: "Unity", file: "tool_unity.svg", folder: "tool-icons" },
  { name: "Maya", file: "tool_maya.svg", folder: "tool-icons" },
  { name: "Houdini", file: "tool_houdini.svg", folder: "tool-icons" },
  { name: "Blender", file: "tool_blender.svg", folder: "tool-icons" },
  { name: "Git", file: "tool_git.svg", folder: "tool-icons" },
  { name: "Docker", file: "tool_docker.svg", folder: "tool-icons" },
  { name: "Jenkins", file: "tool_jenkins.svg", folder: "tool-icons" },
  { name: "Perforce", file: "tool_p4.svg", folder: "tool-icons" },
  { name: "UE4", file: "tool_ue4.svg", folder: "tool-icons" },
  { name: "Photoshop", file: "tool_ps.svg", folder: "tool-icons" },
  { name: "Illustrator", file: "tool_ai.svg", folder: "tool-icons" },
  { name: "After Effects", file: "tool_ae.svg", folder: "tool-icons" },
  { name: "Premiere Pro", file: "tool_pr.svg", folder: "tool-icons" },
  { name: "Adobe XD", file: "tool_xd.svg", folder: "tool-icons" },
  { name: "ZBrush", file: "tool_zbrush.svg", folder: "tool-icons" },
  { name: "Substance Painter", file: "tool_painter.svg", folder: "tool-icons" },
  { name: "Substance Designer", file: "tool_designer.svg", folder: "tool-icons" },
  { name: "Lightroom", file: "tool_lightroom.svg", folder: "tool-icons" },
] as const;

const NETWORK_LINKS: Array<[number, number]> = Array.from(
  new Set(
    ICONS.flatMap((_, i) => {
      const count = ICONS.length;
      const a = `${Math.min(i, (i + 1) % count)}-${Math.max(i, (i + 1) % count)}`;
      const b = `${Math.min(i, (i + 4) % count)}-${Math.max(i, (i + 4) % count)}`;
      const c = `${Math.min(i, (i + 8) % count)}-${Math.max(i, (i + 8) % count)}`;
      return [a, b, c];
    }),
  ),
).map((edge) => {
  const [from, to] = edge.split("-").map(Number);
  return [from ?? 0, to ?? 0] as [number, number];
});

type SphereNode = {
  theta: number;
  phi: number;
  x: number;
  y: number;
  z: number;
};

export default function Page() {
  const reduceMotion = useReducedMotion() ?? false;
  const sectionRef = useRef<HTMLElement>(null);
  const networkStageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || reduceMotion) return;

    const cards = Array.from(
      section.querySelectorAll<HTMLElement>("[data-tool-card]"),
    );
    if (!cards.length) return;

    cards.forEach((card) => {
      card.style.opacity = "0";
      card.style.transform = "translateY(28px) scale(0.9)";
    });

    const cleanups: Array<() => void> = [];
    let started = false;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting || started) return;
        started = true;
        observer.disconnect();

        const reveal = animate(cards, {
          opacity: [0, 1],
          translateY: [28, 0],
          scale: [0.9, 1],
          duration: 620,
          ease: "out(4)",
          delay: stagger(70),
        });
        cleanups.push(() => reveal.revert());

        const sway = animate(cards, {
          rotate: ["-1.8deg", "1.8deg"],
          translateY: ["-2px", "2px"],
          duration: 2100,
          delay: stagger(90),
          loop: true,
          alternate: true,
          ease: "inOut(3)",
        });
        cleanups.push(() => sway.revert());
      },
      { threshold: 0.28 },
    );
    observer.observe(section);

    const cardCleanups = cards.map((card) => {
      const handlePointerDown = () => {
        const press = animate(card, {
          scale: [1, 0.93, 1.02, 1],
          rotate: ["0deg", "-3deg", "2deg", "0deg"],
          duration: 380,
          ease: "out(5)",
        });
        cleanups.push(() => press.revert());
      };
      card.addEventListener("pointerdown", handlePointerDown);
      return () => card.removeEventListener("pointerdown", handlePointerDown);
    });

    return () => {
      observer.disconnect();
      cardCleanups.forEach((cleanup) => cleanup());
      cleanups.forEach((cleanup) => cleanup());
    };
  }, [reduceMotion]);

  useEffect(() => {
    const stage = networkStageRef.current;
    if (!stage) return;

    const nodes = Array.from(
      stage.querySelectorAll<HTMLElement>("[data-network-node]"),
    );
    const links = Array.from(
      stage.querySelectorAll<SVGLineElement>("[data-network-link]"),
    );
    if (!nodes.length || !links.length) return;

    const stageRect = () => stage.getBoundingClientRect();
    const clamp = (value: number, min: number, max: number) =>
      Math.min(max, Math.max(min, value));
    const radiusFor = (rect: DOMRect) => Math.min(rect.width, rect.height) * 0.33;

    const sphereNodes: SphereNode[] = [];
    let spin = 0;
    let rafId = -1;

    for (let i = 0; i < nodes.length; i += 1) {
      const y = 1 - (i / (nodes.length - 1 || 1)) * 2;
      const phi = Math.acos(y);
      const theta = Math.PI * (3 - Math.sqrt(5)) * i;
      sphereNodes.push({ theta, phi, x: 0, y: 0, z: 0 });
    }

    const project = () => {
      const rect = stageRect();
      const cx = rect.width * 0.5;
      const cy = rect.height * 0.5;
      const radius = radiusFor(rect);
      const perspective = 420;

      sphereNodes.forEach((node, i) => {
        const theta = node.theta + spin;
        const x3 = Math.sin(node.phi) * Math.cos(theta);
        const y3 = Math.cos(node.phi);
        const z3 = Math.sin(node.phi) * Math.sin(theta);

        const z = z3 * radius;
        const perspectiveScale = perspective / (perspective - z);
        const x = cx + x3 * radius * perspectiveScale;
        const y = cy + y3 * radius * perspectiveScale;

        node.x = x;
        node.y = y;
        node.z = z;

        const domNode = nodes[i];
        if (!domNode) return;
        domNode.style.left = `${(x / rect.width) * 100}%`;
        domNode.style.top = `${(y / rect.height) * 100}%`;
        domNode.style.setProperty("--node-z", `${z * 0.3}px`);
        domNode.style.setProperty(
          "--node-scale",
          `${clamp(0.8 + (z + radius) / (radius * 2.25), 0.8, 1.16)}`,
        );
        domNode.style.zIndex = String(100 + Math.round(z));
      });

      links.forEach((line) => {
        const from = Number(line.dataset.from);
        const to = Number(line.dataset.to);
        const p1 = sphereNodes[from];
        const p2 = sphereNodes[to];
        if (!p1 || !p2) return;

        line.setAttribute("x1", String(p1.x));
        line.setAttribute("y1", String(p1.y));
        line.setAttribute("x2", String(p2.x));
        line.setAttribute("y2", String(p2.y));

        const avgZ = (p1.z + p2.z) * 0.5;
        line.style.opacity = String(clamp(0.22 + (avgZ + radius) / (radius * 2), 0.22, 0.9));
        line.style.strokeWidth = String(clamp(0.8 + (avgZ + radius) / (radius * 2.8), 0.8, 1.8));
      });
    };

    const dragCleanups = nodes.map((node, index) => {
      let dragging = false;
      let pointerId = -1;

      const onPointerDown = (event: PointerEvent) => {
        dragging = true;
        pointerId = event.pointerId;
        node.setPointerCapture(pointerId);
        node.classList.add(styles.dragging);
      };

      const onPointerMove = (event: PointerEvent) => {
        if (!dragging) return;
        const rect = stageRect();
        const cx = rect.width * 0.5;
        const cy = rect.height * 0.5;
        const radius = radiusFor(rect);
        const dx = clamp(event.clientX - rect.left - cx, -radius, radius);
        const dy = clamp(event.clientY - rect.top - cy, -radius, radius);
        const nx = dx / radius;
        const ny = dy / radius;
        const nz = Math.sqrt(Math.max(0, 1 - nx * nx - ny * ny));

        const target = sphereNodes[index];
        if (!target) return;
        target.theta = Math.atan2(nz, nx) - spin;
        target.phi = Math.acos(clamp(ny, -1, 1));
        project();
      };

      const onPointerUp = () => {
        dragging = false;
        if (pointerId >= 0 && node.hasPointerCapture(pointerId)) {
          node.releasePointerCapture(pointerId);
        }
        node.classList.remove(styles.dragging);
      };

      node.addEventListener("pointerdown", onPointerDown);
      node.addEventListener("pointermove", onPointerMove);
      node.addEventListener("pointerup", onPointerUp);
      node.addEventListener("pointercancel", onPointerUp);

      return () => {
        node.removeEventListener("pointerdown", onPointerDown);
        node.removeEventListener("pointermove", onPointerMove);
        node.removeEventListener("pointerup", onPointerUp);
        node.removeEventListener("pointercancel", onPointerUp);
      };
    });

    const handleStageMove = (event: PointerEvent) => {
      if (reduceMotion) return;
      const rect = stageRect();
      const relX = (event.clientX - rect.left) / rect.width - 0.5;
      const relY = (event.clientY - rect.top) / rect.height - 0.5;
      stage.style.setProperty("--tilt-y", `${relX * 8}deg`);
      stage.style.setProperty("--tilt-x", `${-relY * 8}deg`);
    };

    const handleStageLeave = () => {
      stage.style.setProperty("--tilt-y", "0deg");
      stage.style.setProperty("--tilt-x", "0deg");
    };

    stage.addEventListener("pointermove", handleStageMove);
    stage.addEventListener("pointerleave", handleStageLeave);
    window.addEventListener("resize", project);

    const tick = () => {
      if (!reduceMotion) spin += 0.0026;
      project();
      rafId = window.requestAnimationFrame(tick);
    };
    tick();

    return () => {
      dragCleanups.forEach((cleanup) => cleanup());
      if (rafId >= 0) window.cancelAnimationFrame(rafId);
      stage.removeEventListener("pointermove", handleStageMove);
      stage.removeEventListener("pointerleave", handleStageLeave);
      window.removeEventListener("resize", project);
    };
  }, [reduceMotion]);

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <h1 className={styles.title}>Software &amp; tools</h1>
        <p className={styles.description}>
          スクロールでアイコンが順番に出現し、ゆらぎながら表示。クリックすると軽く触れる
          ようなフィードバックが入る検証ページです。
        </p>
      </section>

      <section ref={sectionRef} className={styles.iconSection}>
        <div className={styles.iconGrid}>
          {ICONS.map((icon) => (
            <button
              key={icon.name}
              type="button"
              data-tool-card
              className={styles.iconCard}
              aria-label={`${icon.name} icon`}
            >
              <img
                src={`/${icon.folder}/${icon.file}`}
                alt={icon.name}
                className={styles.iconImage}
                loading="lazy"
                draggable={false}
              />
              <span className={styles.iconLabel}>{icon.name}</span>
            </button>
          ))}
        </div>
      </section>

      <section className={styles.networkSection}>
        <h2 className={styles.networkTitle}>Connected Network Playground</h2>
        <p className={styles.networkDescription}>
          球体ネットワークのイメージで、ノードがゆっくり自転します。ドラッグすると接続ライン
          が追従して、球面上の位置関係が変化します。
        </p>

        <div ref={networkStageRef} className={styles.networkStage}>
          <div className={styles.networkWorld}>
            <svg
              className={styles.networkSvg}
              viewBox="0 0 1000 560"
              preserveAspectRatio="none"
              aria-hidden
            >
              {NETWORK_LINKS.map(([from, to]) => (
                <line
                  key={`${from}-${to}`}
                  data-network-link
                  data-from={from}
                  data-to={to}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="0"
                  className={styles.networkLine}
                />
              ))}
            </svg>

            {ICONS.map((icon) => (
              <button
                key={`network-${icon.name}`}
                type="button"
                data-network-node
                className={styles.networkNode}
                aria-label={`${icon.name} network node`}
              >
                <img
                  src={`/${icon.folder}/${icon.file}`}
                  alt={icon.name}
                  className={styles.networkIcon}
                  draggable={false}
                />
                <span className={styles.networkLabel}>{icon.name}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <a
        href="/dev"
        className="mx-auto mt-14 inline-block text-sm text-slate-600 underline underline-offset-4 hover:text-slate-900"
      >
        /dev へ戻る
      </a>
    </main>
  );
}
