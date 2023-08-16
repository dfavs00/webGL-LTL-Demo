import React, { useRef, useEffect, useState } from 'react'
import { ExampleScene } from '../ExampleScene'
import { Projection } from '../../GraphicsEngine/Scene'
import { ModelData } from '../../GraphicsEngine/Model';
import { CubeModelData } from '../../Assets/Cube';
import { VertexEditor } from './VertexEditor';
import { vec3 } from 'gl-matrix';

const CANVAS_SCALE: number = 1.5;

export const Example1: React.FC = () => {
    const [canvasHeight, setCanvasHeight] = useState<number>(window.innerHeight / CANVAS_SCALE)
    const [canvasWidth, setCanvasWidth] = useState<number>(window.innerWidth / CANVAS_SCALE)
    const [modelData, setModelData] = useState<ModelData>(CubeModelData)

    const canvasRef = useRef<HTMLCanvasElement | null>(null)
    const example1Ref = useRef<ExampleScene | null>(null)

    

    // handle window resize
    useEffect(() => {
        const handleResize = () => {
            setCanvasHeight(window.innerHeight / CANVAS_SCALE)
            setCanvasWidth(window.innerWidth / CANVAS_SCALE)
        }
    
        window.addEventListener('resize', handleResize)
    
        return () => {
          window.removeEventListener('resize', handleResize)
        }
    }, [])

    useEffect(() => {
        if (example1Ref.current) return

        const canvas = canvasRef.current
        if (!canvas) return

        // Get the WebGL2RenderingContext from the Canvas in a supported Web Browser
        const gl = canvas.getContext('webgl2', { antialias: true })
        if (!gl) {
            console.error('WebGL 2 is not supported by your browser')
            return
        }

        // To view the WebGL code for this example, dive into the Example1VertexData class in the example1.ts file
        const cameraProjectionData: Projection = {
            aspectRatio: (window.innerWidth / CANVAS_SCALE) / (window.innerHeight / CANVAS_SCALE),
            fovY: 1.0472,
            near: 0.1,
            far: 1000
        }

        example1Ref.current = new ExampleScene(gl, CANVAS_SCALE, cameraProjectionData, CubeModelData)
        example1Ref.current?.start((time: number) => {
            example1Ref.current?.rotateModel(vec3.fromValues(0.5, 0.5, 0.5))
        })

        return () => {
            example1Ref.current?.stop()
        }
    }, [])

    const updateModelData = (newVertexData: number[]) => {
        const newModelData: ModelData = {
            vertices: newVertexData,
            indices: modelData.indices,
            normals: modelData.normals,
            textureCoords: modelData.textureCoords
        }

        setModelData(newModelData)
        example1Ref.current?.updateModelData(newModelData)
    }

    return (
        <div>
            <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                <canvas ref={canvasRef} width={canvasWidth} height={canvasHeight} />
                <VertexEditor initialVertexData={CubeModelData.vertices} onUpdate={updateModelData}/>
            </div>
            <div style={{padding: '1rem'}}>
                <h3>
                    A model is made up of vertices, each vertex on a model contains attributes such as position, normal direction, texture coords, etc.
                </h3>
                <h3>
                    The position attribute of the model's vertices are shown in the editor to the right of the canvas. Edit the vertex positions to see how the model changes!
                </h3>
                <h3>(I recommend using the step buttons on the inputs to change the values.)</h3>
                <h3>
                    Reset at any time by refreshing the page!
                </h3>
                <div>
                    *If you are curious why there are more than 8 vertices for this cube model, it is so you can accurately set the normals for each face of the cube. 
                    This is because each face of the cube has a different normal direction, and each vertex can only have one normal direction.
                </div>
            </div>
        </div>
    )
}
