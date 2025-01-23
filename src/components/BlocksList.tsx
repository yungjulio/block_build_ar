import React from "react";
import BlockPreview from "./BlockPreview";
import * as THREE from 'three';

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
            onClick={() => setSelectedBlock(block.name)}
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
