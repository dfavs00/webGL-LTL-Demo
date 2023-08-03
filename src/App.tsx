import React, { useState } from 'react';
import { Example1 } from './LTL-Examples/Example1_VertexData/Example1_VertexData';
import { Example2 } from './LTL-Examples/Example2_Buffers/Example2_Buffers';
import { Example3 } from './LTL-Examples/Example3_Matrices/Example3_Matrices';
import { Example4 } from './LTL-Examples/Example4_Shaders/Example4_Shaders';
import { Example5 } from './LTL-Examples/Example5_DOMEvents/Example5_DOMEvents';

const App = () => {
  const [exampleIndex, setExampleIndex] = useState<number>(0);

  return (
    <div>
      <div style={{display: "flex", justifyContent: 'space-between', padding: '1rem', backgroundColor: '#9A9A9A'}}>
          <button onClick={()=>{setExampleIndex(0)}}>Example 1 - Vertex Data</button>
          <button onClick={()=>{setExampleIndex(1)}}>Example 2 - Buffers</button>
          <button onClick={()=>{setExampleIndex(2)}}>Example 3 - Matrices and Uniforms</button>
          <button onClick={()=>{setExampleIndex(3)}}>Example 4 - Shaders</button>
          <button onClick={()=>{setExampleIndex(4)}}>Example 5 - HTML DOM Events</button>
      </div>
      <div style={{display: 'flex', justifyContent: 'center'}}>
        {exampleIndex === 0 && <Example1 />}
        {exampleIndex === 1 && <Example2 />}
        {exampleIndex === 2 && <Example3 />}
        {exampleIndex === 3 && <Example4 />}
        {exampleIndex === 4 && <Example5 />}
      </div>
    </div>
  )
}

export default App;
