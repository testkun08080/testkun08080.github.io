import React, { useRef, useMemo, useEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Text, OrbitControls } from "@react-three/drei";
import { useControls } from "leva";
import * as THREE from "three";

// Custom shader for bulge effect
const BulgeTextMaterial = ({ mousePos, bulgeRadius, bulgeStrength }) => {
  const materialRef = useRef();

  const vertexShader = `
    uniform vec2 uMouse;
    uniform float uRadius;
    uniform float uStrength;
    
    varying vec2 vUv;
    varying vec3 vPosition;
    
    void main() {
      vUv = uv;
      vPosition = position;
      
      vec3 pos = position;
      
      // Calculate distance from mouse position
      vec2 mouseUV = uMouse;
      float dist = distance(uv, mouseUV);
      
      // Create bulge effect
      float influence = smoothstep(uRadius, 0.0, dist);
      pos.z += influence * uStrength;
      
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `;

  const fragmentShader = `
    uniform vec2 uMouse;
    uniform float uRadius;
    uniform float uStrength;
    uniform vec3 uColor;
    
    varying vec2 vUv;
    varying vec3 vPosition;
    
    void main() {
      vec2 mouseUV = uMouse;
      float dist = distance(vUv, mouseUV);
      
      // Color based on distance from mouse
      float influence = smoothstep(uRadius, 0.0, dist);
      vec3 color = mix(uColor, vec3(1.0, 0.5, 0.2), influence);
      
      // Add some rim lighting
      float rim = 1.0 - dot(normalize(vPosition), vec3(0.0, 0.0, 1.0));
      color += rim * 0.3;
      
      gl_FragColor = vec4(color, 1.0);
    }
  `;

  const uniforms = useMemo(
    () => ({
      uMouse: { value: mousePos },
      uRadius: { value: bulgeRadius },
      uStrength: { value: bulgeStrength },
      uColor: { value: new THREE.Color("#3b82f6") },
    }),
    [mousePos, bulgeRadius, bulgeStrength],
  );

  useFrame(() => {
    if (materialRef.current) {
      materialRef.current.uniforms.uMouse.value = mousePos;
      materialRef.current.uniforms.uRadius.value = bulgeRadius;
      materialRef.current.uniforms.uStrength.value = bulgeStrength;
    }
  });

  return (
    <shaderMaterial
      ref={materialRef}
      vertexShader={vertexShader}
      fragmentShader={fragmentShader}
      uniforms={uniforms}
      side={THREE.DoubleSide}
    />
  );
};

// Interactive 3D Text Component
const InteractiveText3D = () => {
  const meshRef = useRef();
  const { gl } = useThree();
  const [mousePos, setMousePos] = useState(new THREE.Vector2(0.5, 0.5));

  const controls = useControls("3D Text Effects", {
    text: { value: "BULGE TEXT" },
    bulgeRadius: { value: 0.3, min: 0.1, max: 1.0, step: 0.01 },
    bulgeStrength: { value: 0.5, min: 0.0, max: 2.0, step: 0.01 },
    fontSize: { value: 1, min: 0.5, max: 3, step: 0.1 },
    animateText: false,
    rotationSpeed: { value: 0.5, min: 0, max: 2, step: 0.1 },
  });

  // Handle mouse movement
  useEffect(() => {
    const handleMouseMove = (event) => {
      const x = event.clientX / window.innerWidth;
      const y = 1 - event.clientY / window.innerHeight;
      setMousePos(new THREE.Vector2(x, y));
    };

    gl.domElement.addEventListener("mousemove", handleMouseMove);

    return () => {
      gl.domElement.removeEventListener("mousemove", handleMouseMove);
    };
  }, [gl]);

  // Animation
  useFrame((state) => {
    if (meshRef.current && controls.animateText) {
      meshRef.current.rotation.y =
        Math.sin(state.clock.elapsedTime * controls.rotationSpeed) * 0.3;
      meshRef.current.rotation.x =
        Math.cos(state.clock.elapsedTime * controls.rotationSpeed * 0.5) * 0.1;
    }
  });

  return (
    <Text
      ref={meshRef}
      text={controls.text}
      fontSize={controls.fontSize}
      maxWidth={200}
      lineHeight={1}
      letterSpacing={0.02}
      textAlign="center"
      font="https://fonts.gstatic.com/s/raleway/v14/1Ptrg8zYS_SKggPNwK4vaqI.woff"
      anchorX="center"
      anchorY="middle"
      position={[0, 0, 0]}
    >
      <BulgeTextMaterial
        mousePos={mousePos}
        bulgeRadius={controls.bulgeRadius}
        bulgeStrength={controls.bulgeStrength}
      />
    </Text>
  );
};

// Particle background
const ParticleBackground = () => {
  const particlesRef = useRef();
  const particleCount = 1000;

  const positions = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    return positions;
  }, []);

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.05;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.02} color="#444444" transparent opacity={0.6} />
    </points>
  );
};

const Test3D = () => {
  const controls = useControls("3D Scene", {
    showParticles: true,
    cameraDistance: { value: 5, min: 2, max: 15, step: 0.1 },
    backgroundColor: "#0a0a0a",
  });

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        background: controls.backgroundColor,
      }}
    >
      <Canvas
        camera={{ position: [0, 0, controls.cameraDistance], fov: 75 }}
        gl={{ antialias: true }}
      >
        {/* Lighting */}
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight
          position={[-10, -10, -10]}
          intensity={0.5}
          color="#ff6b6b"
        />
        <spotLight
          position={[0, 10, 0]}
          angle={0.3}
          penumbra={1}
          intensity={1}
          castShadow
        />

        {/* Interactive Text */}
        <InteractiveText3D />

        {/* Particle Background */}
        {controls.showParticles && <ParticleBackground />}

        {/* Controls */}
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={2}
          maxDistance={15}
        />
      </Canvas>

      {/* Title overlay */}
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
        Test 3D Interactive Text
      </div>

      {/* Instructions */}
      <div
        style={{
          position: "absolute",
          bottom: 20,
          left: 20,
          color: "rgba(255,255,255,0.7)",
          fontSize: "14px",
          textShadow: "1px 1px 2px rgba(0,0,0,0.8)",
          pointerEvents: "none",
        }}
      >
        Move your mouse to create bulge effects on the text
      </div>
    </div>
  );
};

export default Test3D;
