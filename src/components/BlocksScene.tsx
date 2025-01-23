import React, { useState, useMemo } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import "../App.css";
import BlocksList from "./BlocksList";
import BlockCanvas from "./BlockCanvas";

interface PlacedBlock {
  id: number;
  name: string;
  model: THREE.Object3D;
  position: [number, number, number];
}

const BlocksScene: React.FC = () => {
  // reading the glb block files created in blender
  const blockFiles = [
    { name: "8x2 Block", path: "/assets/8x2.glb" },
    { name: "6x2 Block", path: "/assets/6x2.glb" },
    { name: "4x2 Block", path: "/assets/4x2.glb" },
    { name: "3x2 Block", path: "/assets/3x2.glb" },
    { name: "2x2 Block", path: "/assets/2x2.glb" },

    { name: "6x1 Block", path: "/assets/6x1.glb" },
    { name: "4x1 Block", path: "/assets/4x1.glb" },
    { name: "3x1 Block", path: "/assets/3x1.glb" },
    { name: "2x1 Block", path: "/assets/2x1.glb" },
    { name: "1x1 Block", path: "/assets/1x1.glb" },

    { name: "2x1 Angled Block", path: "/assets/2x1_angled.glb" },
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
        const boundingBox = new THREE.Box3().setFromObject(block.model);
        const blockHeight = (boundingBox.max.y - boundingBox.min.y) * 4;

        setPlacedBlocks((prev) => [
          ...prev,
          {
            id: prev.length,
            name: block.name,
            model: block.model,
            position: [0, prev.reduce((acc) => acc + blockHeight, 0), 0],
          },
        ]);
      }
    }
  };

  return (
    <div className="blocks-container">
      <BlocksList
        allBlocks={allBlocks}
        selectedBlock={selectedBlock}
        setSelectedBlock={setSelectedBlock}
        handleAddBlock={handleAddBlock}
      />

      <BlockCanvas placedBlocks={placedBlocks} />
    </div>
  );
};

export default BlocksScene;
