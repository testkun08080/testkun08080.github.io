import React, { useEffect, useRef } from "react";
import { useControls } from "leva";

const Test2D = () => {
  const canvasRef = useRef(null);
  const animationFrameRef = useRef();
  const mousePosition = useRef({ x: 0, y: 0 });

  const controls = useControls("2D Effects", {
    effectType: {
      value: "ripples",
      options: {
        "Ripple Effect": "ripples",
        "Particle System": "particles",
        "Gradient Waves": "gradientWaves",
        "Noise Field": "noiseField",
      },
    },
    intensity: { value: 1.0, min: 0.1, max: 3.0, step: 0.1 },
    speed: { value: 1.0, min: 0.1, max: 5.0, step: 0.1 },
    color: "#3b82f6",
    backgroundColor: "#1a1a1a",
  });

  // Ripple effect
  const drawRipples = (ctx, time) => {
    const { width, height } = ctx.canvas;
    ctx.clearRect(0, 0, width, height);

    // Background
    ctx.fillStyle = controls.backgroundColor;
    ctx.fillRect(0, 0, width, height);

    const rippleCount = 5;
    for (let i = 0; i < rippleCount; i++) {
      const radius =
        ((time * controls.speed + i * 100) % 800) * controls.intensity;
      const alpha = Math.max(0, 1 - radius / 400);

      ctx.strokeStyle = `${controls.color}${Math.floor(alpha * 255)
        .toString(16)
        .padStart(2, "0")}`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(
        mousePosition.current.x,
        mousePosition.current.y,
        radius,
        0,
        Math.PI * 2,
      );
      ctx.stroke();
    }
  };

  // Particle system
  const drawParticles = (ctx, time) => {
    const { width, height } = ctx.canvas;
    ctx.clearRect(0, 0, width, height);

    ctx.fillStyle = controls.backgroundColor;
    ctx.fillRect(0, 0, width, height);

    const particleCount = 50;
    for (let i = 0; i < particleCount; i++) {
      const angle = (time * controls.speed + i) / 10;
      const radius = 100 + Math.sin(time / 200 + i) * 50 * controls.intensity;
      const x = mousePosition.current.x + Math.cos(angle) * radius;
      const y = mousePosition.current.y + Math.sin(angle) * radius;

      const size = 2 + Math.sin(time / 100 + i) * 2;
      const alpha = (Math.sin(time / 100 + i) + 1) / 2;

      ctx.fillStyle = `${controls.color}${Math.floor(alpha * 255)
        .toString(16)
        .padStart(2, "0")}`;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  // Gradient waves
  const drawGradientWaves = (ctx, time) => {
    const { width, height } = ctx.canvas;
    ctx.clearRect(0, 0, width, height);

    ctx.fillStyle = controls.backgroundColor;
    ctx.fillRect(0, 0, width, height);

    for (let x = 0; x < width; x += 4) {
      for (let y = 0; y < height; y += 4) {
        const distance = Math.sqrt(
          Math.pow(x - mousePosition.current.x, 2) +
            Math.pow(y - mousePosition.current.y, 2),
        );

        const wave =
          Math.sin(distance / 20 - (time * controls.speed) / 100) *
          controls.intensity;
        const alpha = Math.max(0, wave);

        if (alpha > 0) {
          ctx.fillStyle = `${controls.color}${Math.floor(alpha * 255)
            .toString(16)
            .padStart(2, "0")}`;
          ctx.fillRect(x, y, 4, 4);
        }
      }
    }
  };

  // Noise field
  const drawNoiseField = (ctx, time) => {
    const { width, height } = ctx.canvas;
    ctx.clearRect(0, 0, width, height);

    ctx.fillStyle = controls.backgroundColor;
    ctx.fillRect(0, 0, width, height);

    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;

    for (let x = 0; x < width; x += 2) {
      for (let y = 0; y < height; y += 2) {
        const distance = Math.sqrt(
          Math.pow(x - mousePosition.current.x, 2) +
            Math.pow(y - mousePosition.current.y, 2),
        );

        const noise =
          Math.sin(x / 50 + (time * controls.speed) / 200) *
          Math.cos(y / 50 + (time * controls.speed) / 200) *
          Math.exp(-distance / (200 * controls.intensity));

        if (noise > 0) {
          const index = (y * width + x) * 4;
          const color = parseInt(controls.color.slice(1), 16);
          data[index] = (color >> 16) & 0xff; // R
          data[index + 1] = (color >> 8) & 0xff; // G
          data[index + 2] = color & 0xff; // B
          data[index + 3] = Math.floor(noise * 255); // A
        }
      }
    }

    ctx.putImageData(imageData, 0, 0);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    // Set canvas size
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resize();
    window.addEventListener("resize", resize);

    // Mouse tracking
    const handleMouseMove = (e) => {
      mousePosition.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener("mousemove", handleMouseMove);

    // Animation loop
    const animate = (time) => {
      switch (controls.effectType) {
        case "ripples":
          drawRipples(ctx, time);
          break;
        case "particles":
          drawParticles(ctx, time);
          break;
        case "gradientWaves":
          drawGradientWaves(ctx, time);
          break;
        case "noiseField":
          drawNoiseField(ctx, time);
          break;
        default:
          drawRipples(ctx, time);
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [controls]);

  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          cursor: "crosshair",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 20,
          left: 20,
          color: "white",
          fontSize: "24px",
          fontWeight: "bold",
          textShadow: "2px 2px 4px rgba(0,0,0,0.8)",
          pointerEvents: "none",
        }}
      >
        Test 2D Effects
      </div>
    </div>
  );
};

export default Test2D;
