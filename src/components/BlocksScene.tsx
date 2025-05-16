import React, { useState, useEffect, useMemo } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import "../App.css";
import BlocksList from "./BlocksList";
import BlockCanvas from "./BlockCanvas";
import { get, set } from "idb-keyval";
import { debounce } from "lodash";

interface PlacedBlock {
  id: number;
  name: string;
  model: THREE.Object3D;
  position: [number, number, number];
}

interface SerializableBlock {
  id: number;
  name: string;
  position: [number, number, number];
}

interface BlockDefinition {
  name: string;
  model: THREE.Object3D;
}

const BlocksScene: React.FC = () => {
  const gltf8x2 = useGLTF("/assets/8x2.glb");
  const gltf4x2 = useGLTF("/assets/4x2.glb");
  const gltf2x2 = useGLTF("/assets/2x2.glb");
  const gltf4x1 = useGLTF("/assets/4x1.glb");
  const gltf3x1 = useGLTF("/assets/3x1.glb");
  const gltf2x1 = useGLTF("/assets/2x1.glb");
  const gltf1x1 = useGLTF("/assets/1x1.glb");
  const gltfAngled = useGLTF("/assets/2x1_angled.glb");

  const [selectedBlock, setSelectedBlock] = useState<string | null>(null);
  const [placedBlocks, setPlacedBlocks] = useState<PlacedBlock[]>([]);

  const allBlocks = useMemo<BlockDefinition[]>(() => {
    const cloneChildren = (name: string, gltf: any) =>
      gltf.scene.children.map((child: THREE.Object3D, index: number) => ({
        name: `${name} - Part ${index + 1}`,
        model: child.clone(),
      }));

    return [
      ...cloneChildren("8x2 Block", gltf8x2),
      ...cloneChildren("4x2 Block", gltf4x2),
      ...cloneChildren("2x2 Block", gltf2x2),
      ...cloneChildren("4x1 Block", gltf4x1),
      ...cloneChildren("3x1 Block", gltf3x1),
      ...cloneChildren("2x1 Block", gltf2x1),
      ...cloneChildren("1x1 Block", gltf1x1),
      ...cloneChildren("2x1 Angled Block", gltfAngled),
    ];
  }, [
    gltf8x2,
    gltf4x2,
    gltf2x2,
    gltf4x1,
    gltf3x1,
    gltf2x1,
    gltf1x1,
    gltfAngled,
  ]);

  const findModelByName = (name: string): THREE.Object3D | null => {
    const found = allBlocks.find((b) => b.name === name);
    return found ? found.model.clone() : null;
  };

  const handleAddBlock = () => {
    if (!selectedBlock) return;

    const model = findModelByName(selectedBlock);
    if (!model) return;

    setPlacedBlocks((prev) => {

      const totalHeight = prev.reduce((acc, block) => {
        const bb = new THREE.Box3().setFromObject(block.model);
        return acc + (bb.max.y - bb.min.y) * 0.85;
      }, 0);

      return [
        ...prev,
        {
          id: prev.length,
          name: selectedBlock,
          model,
          position: [0, totalHeight, 0],
        },
      ];
    });
  };

  const handleClearBlocks = () => {
    setPlacedBlocks([]);
    set("placed-blocks", []);
  };
  

  const debouncedSave = useMemo(
    () =>
      debounce((blocks: PlacedBlock[]) => {
        const serializable = blocks.map((b) => ({
          id: b.id,
          name: b.name,
          position: b.position,
        }));
        set("placed-blocks", serializable);
      }, 300),
    []
  );

  useEffect(() => {
    debouncedSave(placedBlocks);
  }, [placedBlocks]);

  useEffect(() => {
    const restore = async () => {
      const saved = await get("placed-blocks");
      if (!saved || !Array.isArray(saved)) return;

      const restored = (saved as SerializableBlock[])
        .map((data) => {
          const model = findModelByName(data.name);
          if (!model) return null;
          return {
            id: data.id,
            name: data.name,
            model,
            position: data.position,
          } as PlacedBlock;
        })
        .filter(Boolean) as PlacedBlock[];

      setPlacedBlocks(restored);
    };

    restore();
  }, [allBlocks]);

  return (
    <div className="blocks-container">
      <BlocksList
        allBlocks={allBlocks.map((b) => ({
          name: b.name,
          model: b.model,
          scene: <primitive object={b.model} key={b.name} />,
        }))}
        selectedBlock={selectedBlock}
        setSelectedBlock={setSelectedBlock}
        handleAddBlock={handleAddBlock}
        handleClearBlocks={handleClearBlocks}
      />
      <BlockCanvas placedBlocks={placedBlocks} />
    </div>
  );
};

export default BlocksScene;
