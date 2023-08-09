import React, { useState, useEffect, ChangeEvent } from 'react';
import { vec3 } from 'gl-matrix';

interface VertexProps {
    initialData: vec3
    onUpdate: (index: number, newData: vec3) => void
    dataIndex: number
}

const Vertex: React.FC<VertexProps> = ({initialData, onUpdate, dataIndex}: VertexProps) => {
    const [vertexData, setVertexData] = useState<vec3>(initialData)

    const updateVertex = (event: ChangeEvent<HTMLInputElement>, index: number): void => {
        const updatedData: number = Number(event.target.value)
        const newData: vec3 = vec3.clone(vertexData)
        newData[index] = updatedData
        setVertexData(newData)
        onUpdate(dataIndex + index, newData)
    }

    return (
        <div style={{display: 'flex', gap: '1rem', justifyContent: 'space-between'}}>
            <span>
                <label>x:</label>
                <input 
                    type='number'
                    step={0.5}
                    value={vertexData[0]} 
                    onChange={(event) => updateVertex(event, 0)} 
                    style={{width: '75px'}} 
                />
            </span>
            <span >
                <label>y:</label>
                <input 
                    type='number'
                    step={0.5}
                    value={vertexData[1]} 
                    onChange={(event) => updateVertex(event, 1)}
                    style={{width: '75px'}} 
                />
            </span>
            <span>
                <label>z:</label>
                <input 
                    type='number'
                    step={0.5}
                    value={vertexData[2]} 
                    onChange={(event) => updateVertex(event, 2)} 
                    style={{width: '75px'}} 
                />
            </span>
        </div>
    )
}

interface VertexEditorProps {
    initialVertexData: number[]
    onUpdate: (newVertexData: number[]) => void
}

export const VertexEditor: React.FC<VertexEditorProps> = ({initialVertexData, onUpdate}: VertexEditorProps) => {
    const [vertexEditorData, setVertexEditorData] = useState<vec3[]>([])

    // on initial render convert a number list to vec3 list assuming 3 consecutive numbers make a vec3
    useEffect(() => {
        const newVertexEditorData: vec3[] = []
        for (let i = 0; i < initialVertexData.length; i += 3) {
            const vec3Data: vec3 = vec3.fromValues(
                initialVertexData[i],
                initialVertexData[i + 1],
                initialVertexData[i + 2]
            )
            newVertexEditorData.push(vec3Data)
        }

        setVertexEditorData(newVertexEditorData)
    }, [initialVertexData])

    const updateVertexData = (index: number, newData: vec3) => {
        const newVertexEditorData = [...vertexEditorData]
        newVertexEditorData[index] = newData
        setVertexEditorData(newVertexEditorData)

        const newVertexData: number[] = []
        for (let i = 0; i < newVertexEditorData.length; i++) {
            newVertexData.push(newVertexEditorData[i][0])
            newVertexData.push(newVertexEditorData[i][1])
            newVertexData.push(newVertexEditorData[i][2])
        }

        onUpdate(newVertexData)
    }

    return (
        <div style={{
            overflowY: 'scroll', 
            maxHeight: `700px`,
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
            padding: '0.5rem',
            margin: '0.5rem',
            border: '1px solid black',
            borderRadius: '0.5rem',
        }}>
            {vertexEditorData.map((vertexData, index) => {
                return (
                    <Vertex key={index} dataIndex={index} initialData={vertexData} onUpdate={updateVertexData} />
                )
            })}
        </div>
    )
}