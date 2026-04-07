import React from "react";
import { Canvas } from "@react-three/fiber";
import Scene from "../components/Scene";
import PostEffects from "../components/postprocessing/PostEffects";

const PostEffectsSample = () => {
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Canvas>
        <Scene />
        <PostEffects />
      </Canvas>
    </div>
  );
};

export default PostEffectsSample;
