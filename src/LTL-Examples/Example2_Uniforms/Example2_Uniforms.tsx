import React, { useRef, useEffect, useState } from 'react'
import { ExampleScene } from '../ExampleScene'
import { Projection } from '../../GraphicsEngine/Scene'
import { CubeModelData } from '../../Assets/Cube';
import { quat, vec3 } from 'gl-matrix';
import { ColorEditor, TransformEditor } from './TransformEditor';
import { Transform } from '../../GraphicsEngine/Transform';

const CANVAS_SCALE: number = 1.5;
const initialCameraTransform = new Transform(vec3.fromValues(0, 0, -3))
const initialModelTransform = new Transform()
const initialColor: vec3 = vec3.fromValues(0.25, 1.0, 0.75);

export const Example2: React.FC = () => {
    const [canvasHeight, setCanvasHeight] = useState<number>(window.innerHeight / CANVAS_SCALE)
    const [canvasWidth, setCanvasWidth] = useState<number>(window.innerWidth / CANVAS_SCALE)

    const canvasRef = useRef<HTMLCanvasElement | null>(null)
    const sceneRef = useRef<ExampleScene | null>(null)

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
        if (sceneRef.current) return

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
            aspectRatio: canvasWidth / canvasHeight,
            fovY: 1.0472,
            near: 0.1,
            far: 1000
        }

        sceneRef.current = new ExampleScene(gl, CANVAS_SCALE, cameraProjectionData, CubeModelData, initialModelTransform, initialCameraTransform)
        sceneRef.current?.start((time: number) => {})

        return () => {
            sceneRef.current?.stop()
        }
    }, [canvasHeight, canvasWidth])

    const onCameraUpdate = (newPosition: vec3, newRotation: vec3, newScale: vec3) => {
        sceneRef.current?.updateCameraTransform(
            newPosition, 
            quat.fromEuler(quat.create(), newRotation[0], newRotation[1], newRotation[2])
        )
    }

    const onModelUpdate = (newPosition: vec3, newRotation: vec3, newScale: vec3) => {
        sceneRef.current?.updateModelTransform(
            newPosition, 
            quat.fromEuler(quat.create(), newRotation[0], newRotation[1], newRotation[2]),
            newScale
        )
    }

    const onColorUpdate = (newColor: vec3) => {
        sceneRef.current?.updateColor(newColor)
    }

    return (
        <div>
            <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                <canvas ref={canvasRef} width={canvasWidth} height={canvasHeight} />
                <div style={{display: 'flex', flexDirection: 'column',}}>
                    <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                        <TransformEditor 
                            initialPosition={initialCameraTransform.position} 
                            initialRotation={vec3.fromValues(0, 0, 0)} 
                            initialScale={initialCameraTransform.scale}
                            labelName='Camera Transform'
                            onUpdate={onCameraUpdate}
                        />
                        <TransformEditor 
                            initialPosition={initialModelTransform.position} 
                            initialRotation={vec3.fromValues(0, 0, 0)} 
                            initialScale={initialModelTransform.scale}
                            labelName='Cube Transform'
                            onUpdate={onModelUpdate}
                        />
                    </div>
                    <ColorEditor 
                        initialColor={initialColor}
                        onUpdate={onColorUpdate}
                    />
                </div>
            </div>
            <div style={{padding: '1rem'}}>
                <h3>
                    Uniform Variables are variables that remain the same throughout the execution of a shader on all the vertices or fragments.
                </h3>
                <h3>As you change the uniforms to the right of the canvas, the shader is given a new constant value to use when it renders the object.</h3>
                <h4>
                    Watch how the object changes as you alter the uniforms!
                </h4>
                <div>
                    Note: The camera and model transforms seen here are actually converted to matrices before they are sent to the shaders as uniforms.
                </div>
            </div>
        </div>
    )
}