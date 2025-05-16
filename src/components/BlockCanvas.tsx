import React, { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { ARButton } from "three/examples/jsm/webxr/ARButton.js";

interface PlacedBlock {
  id: number;
  name: string;
  model: THREE.Object3D;
  position: [number, number, number];
}

interface BlockCanvasProps {
  placedBlocks: PlacedBlock[];
}

const BlockCanvas: React.FC<BlockCanvasProps> = ({ placedBlocks }) => {
  const [isARActive] = useState(false);

  return (
    <Canvas
      className="lego-canvas"
      camera={{ position: [0, 0.1, 0.5], fov: 45 }}
      gl={{ antialias: true, alpha: true }}
      onCreated={({ gl }) => {
        gl.xr.enabled = true;
        const overlayElement = document.getElementById("overlay");
        const arButton = ARButton.createButton(gl, {
          sessionInit: {
            optionalFeatures: ["dom-overlay"],
            domOverlay: { root: overlayElement }
          }
        } as any) as HTMLButtonElement;
        document.body.appendChild(arButton);
      }}
      
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <OrbitControls />

      {/* Render placed blocks */}
      {placedBlocks.map((block) => (
        <primitive
          key={block.id}
          object={block.model}
          position={isARActive
            ? [block.position[0], block.position[1], block.position[2] - 1] // shift forward for AR
            : block.position}
          scale={[1, 1, 1]}
        />
      ))}
    </Canvas>
  );
};

export default BlockCanvas;
