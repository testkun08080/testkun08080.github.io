import React from "react";
import {
  OrbitControls,
  useGLTF,
  Sphere,
  Torus,
  Cylinder,
  Cone,
  Plane,
  Environment,
  Sky,
} from "@react-three/drei";
import { useControls } from "leva";
import Box from "./Box";

// Suzanne Model Component (based on gltfjsx auto-generation)
const SceneModel = () => {
  const { nodes } = useGLTF("/scene.glb");
  return (
    <group>
      <primitive object={nodes.Scene} />
    </group>
  );
};

const Scene = () => {
  const sceneControls = useControls("Scene Models", {
    modelType: {
      value: "basic_shapes",
      options: {
        "Basic Shapes": "basic_shapes",
        "My scene": "my_scene",
      },
    },
    showBoxes: true,
    showEnvironment: true,
    modelSpacing: { value: 3, min: 1, max: 8, step: 0.5 },
  });

  const renderModels = () => {
    const spacing = sceneControls.modelSpacing;

    switch (sceneControls.modelType) {
      case "basic_shapes":
        return (
          <>
            <Sphere args={[0.8]} position={[-spacing, 0, 0]}>
              <meshStandardMaterial color="hotpink" />
            </Sphere>
            <Torus args={[0.6, 0.3]} position={[0, 0, 0]}>
              <meshStandardMaterial color="orange" />
            </Torus>
            <Cylinder args={[0.5, 0.7, 1.5]} position={[spacing, 0, 0]}>
              <meshStandardMaterial color="lightblue" />
            </Cylinder>
            <Cone args={[0.6, 1.2]} position={[0, 0, spacing]}>
              <meshStandardMaterial color="lightgreen" />
            </Cone>
          </>
        );

      case "my_scene":
        return <SceneModel />;

      default:
        return null;
    }
  };

  return (
    <>
      {/* Sky */}
      {/* <Sky sunPosition={[5, 5, 0]} /> */}
      {/* <Environment background near={1} far={1000} resolution={256}> */}

      {/* Camera Controls */}
      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={2}
        maxDistance={20}
        maxPolarAngle={Math.PI / 1.5}
      />

      {/* Lighting */}
      {/* <ambientLight intensity={Math.PI / 2} /> */}
      <ambientLight intensity={0.5} />

      <spotLight
        position={[10, 10, 10]}
        angle={0.15}
        penumbra={1}
        decay={0}
        intensity={Math.PI}
      />
      <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />

      {/* Ground Plane */}

      <Plane
        args={[20, 20]}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -2, 0]}
      >
        <meshStandardMaterial color="gray" />
      </Plane>

      {/* Original Boxes (optional) */}
      {sceneControls.showBoxes && (
        <>
          <Box position={[-1.2, 0, 0]} />
          <Box position={[1.2, 0, 0]} />
        </>
      )}

      {/* Dynamic Models */}
      {renderModels()}

      {/* Environment */}
      {sceneControls.showEnvironment && (
        <Environment
          preset="city"
          background
          near={1}
          far={1000}
          resolution={256}
          frames={Infinity}
        ></Environment>
      )}
    </>
  );
};

export default Scene;
