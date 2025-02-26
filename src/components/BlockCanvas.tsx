import React, { useRef } from "react";
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
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  return (
    <Canvas
      className="lego-canvas"
      camera={{ position: [0, 0.5, 2], fov: 45 }}
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
          position={block.position}
          scale={[5, 5, 5]}
        />
      ))}
    </Canvas>
  );
};

export default BlockCanvas;
