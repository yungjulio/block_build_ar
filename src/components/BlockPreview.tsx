import React from "react";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";

const BlockPreview: React.FC<{ model: THREE.Object3D; scale: number }> = ({
  model,
  scale,
}) => {
  return (
    <Canvas
      style={{
        width: "100%",
        height: "100%",
      }}
      orthographic
      camera={{
        zoom: 100,
        position: [0, 7, 10],
      }}
    >
      <ambientLight intensity={0.5} />
      <primitive object={model.clone()} scale={[scale, scale, scale]} />
    </Canvas>
  );
};

export default BlockPreview;
