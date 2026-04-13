import { useRef, useMemo, useEffect, useState } from "react";
import { debounce } from "lodash";
import PropTypes from "prop-types";

// 3D
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import CustomShaderMaterial from "three-custom-shader-material";
import html2canvas from "html2canvas";

import fragmentShader from "../shaders/bulge-fragment.glsl";
import vertexShader from "../shaders/bulge-vertex.glsl";

/**
 * DOM要素をCanvasTextureに変換するカスタムフック
 */
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

/**
 * 3Dシーンコンポーネント
 */
function Scene({ children, intensity = 0.5, smoothness = 0.1 }) {
  const state = useThree();
  const { width, height } = state.viewport;
  const [domEl, setDomEl] = useState(null);

  const materialRef = useRef();
  const textureDOM = useDomToCanvas(domEl);

  const uniforms = useMemo(
    () => ({
      uTexture: { value: textureDOM },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uIntensity: { value: intensity },
    }),
    [textureDOM, intensity]
  );

  const mouseLerped = useRef({ x: 0, y: 0 });

  useFrame((state) => {
    const { pointer } = state;
    mouseLerped.current.x = THREE.MathUtils.lerp(
      mouseLerped.current.x,
      pointer.x,
      smoothness
    );
    mouseLerped.current.y = THREE.MathUtils.lerp(
      mouseLerped.current.y,
      pointer.y,
      smoothness
    );

    if (materialRef.current) {
      materialRef.current.uniforms.uMouse.value.x = mouseLerped.current.x;
      materialRef.current.uniforms.uMouse.value.y = mouseLerped.current.y;
    }
  });

  return (
    <>
      <Html zIndexRange={[-1, -10]} prepend fullscreen>
        <div ref={(el) => setDomEl(el)} className="dom-element">
          {children}
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
      </mesh>
    </>
  );
}

Scene.propTypes = {
  children: PropTypes.node.isRequired,
  intensity: PropTypes.number,
  smoothness: PropTypes.number,
};

/**
 * BulgeTextOverlay - 外部から渡されたDOM要素にバルジエフェクトを適用するコンポーネント
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - エフェクトを適用するDOM要素
 * @param {number} [props.intensity=0.5] - エフェクトの強度 (0-1)
 * @param {number} [props.smoothness=0.1] - マウス追従のスムーズさ (0-1)
 * @param {number} [props.fov=55] - カメラのFOV
 * @param {string} [props.className] - コンテナに適用する追加のクラス名
 *
 * @example
 * <BulgeTextOverlay intensity={0.7} smoothness={0.15}>
 *   <h1>Hello World</h1>
 * </BulgeTextOverlay>
 */
function BulgeTextOverlay({
  children,
  intensity = 0.5,
  smoothness = 0.1,
  fov = 55,
  className = ""
}) {
  return (
    <div className={`absolute top-0 left-0 h-screen w-screen ${className}`}>
      <Canvas
        dpr={[1, 2]}
        gl={{
          antialias: true,
          preserveDrawingBuffer: true,
        }}
        camera={{
          fov,
          near: 0.1,
          far: 200,
        }}
      >
        <Scene intensity={intensity} smoothness={smoothness}>
          {children}
        </Scene>
      </Canvas>
    </div>
  );
}

BulgeTextOverlay.propTypes = {
  children: PropTypes.node.isRequired,
  intensity: PropTypes.number,
  smoothness: PropTypes.number,
  fov: PropTypes.number,
  className: PropTypes.string,
};

export default BulgeTextOverlay;
