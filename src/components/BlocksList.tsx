import React, { useState } from "react";
import BlockPreview from "./BlockPreview";
import * as THREE from "three";

interface BlocksListProps {
  allBlocks: {
    name: string;
    model: THREE.Object3D;
    scene: JSX.Element;
  }[];
  selectedBlock: string | null;
  setSelectedBlock: React.Dispatch<React.SetStateAction<string | null>>;
  handleAddBlock: () => void;
}

const BlocksList: React.FC<BlocksListProps> = ({
  allBlocks,
  selectedBlock,
  setSelectedBlock,
  handleAddBlock,
}) => {
  const [lastTap, setLastTap] = useState<number | null>(null);

  const handleClick = (blockName: string) => {
    const now = Date.now();
    // If within 300ms of the previous tap, consider it a double tap
    if (lastTap && now - lastTap < 300) {
      console.log("Double-tap detected:", blockName);
      setSelectedBlock(blockName);
      handleAddBlock();
    } else {
      // Single tap: simply select the block
      setSelectedBlock(blockName);
    }
    setLastTap(now);
  };

  return (
    <div className="blocksList-sidebar">
      <h3>Blocks</h3>
      <ul className="blocksList">
        {allBlocks.map((block, index) => (
          <li
            key={index}
            className={`blocksList-item ${
              selectedBlock === block.name ? "selected" : ""
            }`}
            onClick={() => handleClick(block.name)}
          >
            <BlockPreview model={block.model} scale={25} />
          </li>
        ))}
      </ul>
      <button onClick={handleAddBlock} disabled={!selectedBlock}>
        Add Block to Canvas
      </button>
    </div>
  );
};

export default BlocksList;
