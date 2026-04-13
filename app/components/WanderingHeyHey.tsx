import { motion, useAnimation, useMotionValue } from "motion/react";
import { useEffect, useState } from "react";

export function WanderingHeyHey() {
  const controls = useAnimation();
  const [isDragging, setIsDragging] = useState(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  useEffect(() => {
    let active = true;

    const wander = async () => {
      while (active) {
        if (!isDragging) {
          // Calculate random destination within screen bounds
          const w = typeof window !== "undefined" ? window.innerWidth : 800;
          const h = typeof window !== "undefined" ? window.innerHeight : 800;
          
          // Next target
          const targetX = (Math.random() - 0.5) * (w - 150);
          const targetY = (Math.random() - 0.5) * (h - 150);
          
          const duration = 4 + Math.random() * 4;

          try {
            await controls.start({
              x: targetX,
              y: targetY,
              transition: { duration, ease: "easeInOut" }
            });
          } catch (err) {
            // ignore interruption
          }
          
          if (active && !isDragging) {
            // Pause before the next wander
            await new Promise(r => setTimeout(r, Math.random() * 2000));
          }
        } else {
          // If dragging, wait before trying again
          await new Promise(r => setTimeout(r, 1000));
        }
      }
    };

    wander();
    return () => { active = false; };
  }, [controls, isDragging]);

  return (
    <motion.div
      drag
      dragMomentum={true}
      dragElastic={0.2}
      onDragStart={() => {
        setIsDragging(true);
        controls.stop(); 
      }}
      onDragEnd={(e, info) => {
        setIsDragging(false);
      }}
      animate={controls}
      style={{
        position: "fixed",
        top: "50%",
        left: "50%",
        width: "120px",
        height: "120px",
        x, 
        y,
        marginLeft: "-60px",
        marginTop: "-60px",
        zIndex: 80, // High, but header is usually 90
        cursor: isDragging ? "grabbing" : "grab",
      }}
    >
      <img 
        src="/heyhey.png" 
        alt="hey hey" 
        style={{ width: "100%", height: "100%", pointerEvents: "none" }} 
      />
    </motion.div>
  );
}
