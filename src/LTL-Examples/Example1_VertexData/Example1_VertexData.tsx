import React, { useRef, useEffect, useState } from 'react'
import { Example1VertexData } from './example1'

export const Example1: React.FC = () => {
    const [canvasHeight, setCanvasHeight] = useState<number>(window.innerHeight / 2)
    const [canvasWidth, setCanvasWidth] = useState<number>(window.innerWidth / 2)

    const canvasRef = useRef<HTMLCanvasElement | null>(null)
    const example1Ref = useRef<Example1VertexData | null>(null)

    // handle window resize
    useEffect(() => {
        const handleResize = () => {
            setCanvasHeight(window.innerHeight / 2)
            setCanvasWidth(window.innerWidth / 2)
        }
    
        window.addEventListener('resize', handleResize)
    
        return () => {
          window.removeEventListener('resize', handleResize)
        }
      }, [])

      useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        // Get the WebGL2RenderingContext from the Canvas in a supported Web Browser
        const gl = canvas.getContext('webgl2', { antialias: true })
        if (!gl) {
            console.error('WebGL 2 is not supported by your browser')
            return
        }

        // To view the WebGL code for this example, dive into the Example1VertexData class in the example1.ts file
        example1Ref.current = new Example1VertexData(gl)
        example1Ref.current?.start()

        return () => {
            example1Ref.current?.stop()
        }
    }, [])

    return <canvas ref={canvasRef} width={canvasWidth} height={canvasHeight} />

}
