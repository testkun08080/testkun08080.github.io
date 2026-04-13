import { useRef, useMemo, useEffect, useState } from "react";
import { useControls } from "leva";
import { debounce } from "lodash";
import { Leva } from "leva";

// 3D
import * as THREE from "three";
import { PointLightHelper } from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useHelper, Html } from "@react-three/drei";
import CustomShaderMaterial from "three-custom-shader-material";
import html2canvas from "html2canvas";

import fragmentShader from "../shaders/bulge-fragment.glsl";
import vertexShader from "../shaders/bulge-vertex.glsl";

const useDomToCanvas = (domEl) => {
  const [texture, setTexture] = useState();
  useEffect(() => {
    if (!domEl) return;
    const convertDomToCanvas = async () => {
      const canvas = await html2canvas(domEl, { backgroundColor: null });
      setTexture(new THREE.CanvasTexture(canvas));
    };

    convertDomToCanvas();

    const debouncedResize = debounce(() => {
      convertDomToCanvas();
    }, 100);

    window.addEventListener("resize", debouncedResize);
    return () => {
      window.removeEventListener("resize", debouncedResize);
    };
  }, [domEl]);

  return texture;
};

function Lights() {
  const pointLightRef = useRef();

  useHelper(pointLightRef, PointLightHelper, 0.7, "cyan");

  const config = useControls("Lights", {
    color: "#ffffff",
    intensity: { value: 30, min: 0, max: 5000, step: 0.01 },
    distance: { value: 12, min: 0, max: 100, step: 0.1 },
    decay: { value: 1, min: 0, max: 5, step: 0.1 },
    position: { value: [2, 4, 6] },
  });
  return <pointLight ref={pointLightRef} {...config} />;
}

function Scene() {
  const state = useThree();
  const { width, height } = state.viewport;
  const [domEl, setDomEl] = useState(null);

  const materialRef = useRef();
  const textureDOM = useDomToCanvas(domEl);

  const uniforms = useMemo(
    () => ({
      uTexture: { value: textureDOM },
      uMouse: { value: new THREE.Vector2(0, 0) },
    }),
    [textureDOM]
  );

  const mouseLerped = useRef({ x: 0, y: 0 });

  useFrame((state) => {
    const { pointer } = state;
    mouseLerped.current.x = THREE.MathUtils.lerp(
      mouseLerped.current.x,
      pointer.x,
      0.1
    );
    mouseLerped.current.y = THREE.MathUtils.lerp(
      mouseLerped.current.y,
      pointer.y,
      0.1
    );
    materialRef.current.uniforms.uMouse.value.x = mouseLerped.current.x;
    materialRef.current.uniforms.uMouse.value.y = mouseLerped.current.y;
  });

  return (
    <>
      <Html zIndexRange={[-1, -10]} prepend fullscreen>
        <div ref={(el) => setDomEl(el)} className="dom-element">
          <p className="flex flex-col">
            WHEN <br />
            WILL <br />
            WE <br />
            MEET ?<br />
          </p>
        </div>
      </Html>
      <mesh>
        <planeGeometry args={[width, height, 254, 254]} />
        <CustomShaderMaterial
          ref={materialRef}
          baseMaterial={THREE.MeshPhysicalMaterial}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={uniforms}
          flatShading
        />
        <Lights />
      </mesh>
    </>
  );
}

function BulgeTextEffect() {
  return (
    <>
      <Leva
        collapsed={false}
        flat={true}
        hidden
        theme={{
          sizes: {
            titleBarHeight: "28px",
          },
          fontSizes: {
            root: "10px",
          },
        }}
      />
      <div className="absolute top-0 left-0 h-screen w-screen">
        <Canvas
          dpr={[1, 2]}
          gl={{
            antialias: true,
            preserveDrawingBuffer: true,
          }}
          camera={{
            fov: 55,
            near: 0.1,
            far: 200,
          }}
        >
          <Scene />
        </Canvas>
      </div>
    </>
  );
}

export default BulgeTextEffect;
