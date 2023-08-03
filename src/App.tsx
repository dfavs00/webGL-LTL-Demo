import React, { useState } from 'react';
import Render from './Render';
import { Transform } from './GraphicsEngine/Transform';
import { AsymmetricalStack, boxes4x2 } from './BoxConfig';

function App() {
  const [boxConfig, setBoxConfig] = useState<Transform[]>(AsymmetricalStack)

  return (
    <>
      <div style={{display: "flex", justifyContent: 'space-between', gap: '1rem', flexDirection: 'column'}}>
        <div>
          <button onClick={()=>{setBoxConfig(boxes4x2)}}>4x2</button>
          <button onClick={()=>{setBoxConfig(AsymmetricalStack)}}>Asymmetrical</button>
        </div>
        <Render loading={false} boxConfig={boxConfig}/>
      </div>
    </>
  )
}

export default App;
