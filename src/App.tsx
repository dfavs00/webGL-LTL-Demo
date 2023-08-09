import React, { useState } from 'react';
import { Example1 } from './LTL-Examples/Example1_VertexData/Example1_VertexData';
import { Example2 } from './LTL-Examples/Example2_Uniforms/Example2_Uniforms';
import { Example3 } from './LTL-Examples/Example3_Shaders/Example3_Shaders';
import { Example4 } from './LTL-Examples/Example4_DOMEvents/Example4_DOMEvents';

const App = () => {
  const [exampleIndex, setExampleIndex] = useState<number>(0);

  return (
    <div>
      <div style={{display: "flex", justifyContent: 'space-between', padding: '1rem', backgroundColor: '#9A9A9A'}}>
          <button onClick={()=>{setExampleIndex(0)}}>Example 1 - Vertex Data</button>
          <button onClick={()=>{setExampleIndex(1)}}>Example 2 - Matrices and Uniforms</button>
          <button onClick={()=>{setExampleIndex(2)}}>Example 3 - Shaders</button>
          <button onClick={()=>{setExampleIndex(3)}}>Example 4 - HTML DOM Events</button>
      </div>
      <div style={{height: "100%", display: 'flex', alignItems: 'center'}}>
        {exampleIndex === 0 && <Example1 />}
        {exampleIndex === 1 && <Example2 />}
        {exampleIndex === 2 && <Example3 />}
        {exampleIndex === 3 && <Example4 />}
      </div>
    </div>
  )
}

export default App;
