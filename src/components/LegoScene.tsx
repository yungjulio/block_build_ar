import React, { useState, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import "../App.css";
import BlockPreview from "./BlockPreview";

interface PlacedBlock {
  name: string;
  scene: JSX.Element;
  position: [number, number, number];
}

// const BlockPreview: React.FC<{ model: THREE.Object3D; scale: number }> = ({
//     model,
//     scale,
//   }) => {
//     return (
//       <Canvas
//         style={{
//           width: "100%",
//           height: "100%",
//         }}
//         orthographic
//         camera={{
//           zoom: 100,
//           position: [0, 7, 10],
//         }}
//       >
//         <ambientLight intensity={0.5} />
//         <primitive object={model.clone()} scale={[scale, scale, scale]} />
//       </Canvas>
//     );
//   };
  

const LegoScene: React.FC = () => {
  const blockFiles = [
    { name: "8x2 Block", path: "/assets/8x2.glb" },
    { name: "4x2 Block", path: "/assets/4x2.glb" },
    { name: "2x2 Block", path: "/assets/2x2.glb" },
  ];

  const [selectedBlock, setSelectedBlock] = useState<string | null>(null);
  const [placedBlocks, setPlacedBlocks] = useState<PlacedBlock[]>([]);

  const allBlocks = useMemo(() => {
    return blockFiles.flatMap((file, fileIndex) => {
      const { scene } = useGLTF(file.path);
      return scene.children.map((child, index) => ({
        name: `${file.name} - Part ${index + 1}`,
        model: child.clone(),
        scene: (
          <primitive
            object={child.clone()}
            key={`${fileIndex}-${index}`}
          />
        ),
      }));
    });
  }, [blockFiles]);

  const handleAddBlock = () => {
    if (selectedBlock) {
      const block = allBlocks.find((b) => b.name === selectedBlock);
      if (block) {
        const boundingBox = new THREE.Box3().setFromObject(block.scene.props.object);
        const blockHeight = (boundingBox.max.y - boundingBox.min.y) * 4;

        setPlacedBlocks((prev) => [
          ...prev,
          {
            ...block,
            position: [0, prev.reduce((acc) => acc + blockHeight, 0), 0],
          },
        ]);
      }
    }
  };

  return (
    <div className="lego-container">
      <div className="lego-sidebar">
        <h3>Blocks</h3>
        <ul className="lego-block-list">
          {allBlocks.map((block, index) => (
            <li
              key={index}
              className={`lego-block-item ${
                selectedBlock === block.name ? "selected" : ""
              }`}
              onClick={() => setSelectedBlock(block.name)}
            >
              <BlockPreview model={block.model} scale={25} />
              {/* <span>{block.name}</span> */}
            </li>
          ))}
        </ul>
        <button onClick={handleAddBlock} disabled={!selectedBlock}>
          Add Block to Canvas
        </button>
      </div>

      <Canvas
        className="lego-canvas"
        camera={{
          position: [0, 0.5, 2],
          fov: 45,
        }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <OrbitControls />


        {placedBlocks.map((block, index) => (
          <primitive
            key={index}
            object={block.scene.props.object}
            position={block.position}
            scale={[5, 5, 5]}
          />
        ))}
      </Canvas>
    </div>
  );
};

export default LegoScene;
