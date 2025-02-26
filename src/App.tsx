import React from "react";
import BlocksScene from "./components/BlocksScene";

const App: React.FC = () => {
  return (
    <div>
      <BlocksScene />
      <div id="overlay">
        {/* Place any UI components you want visible during AR here */}
      </div>
    </div>
  );
};

export default App;
