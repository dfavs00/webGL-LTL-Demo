import { vec3 } from 'gl-matrix';
import React, { useState, ChangeEvent } from 'react';

const stringArrayToVec3 = (stringArray: string[]): vec3 => {
    return vec3.fromValues(Number(stringArray[0]), Number(stringArray[1]), Number(stringArray[2]))
}

interface Vector3EditorProps {
    dataLabel: string
    initialData: string[] // must be length 3
    onUpdate: (newData: vec3) => void
    step?: number
    max?: number
    min?: number
}

const Vector3Editor: React.FC<Vector3EditorProps> = ({dataLabel, initialData, onUpdate, step, max, min}) => {
    const [data, setData] = useState<string[]>(initialData)

    const onBlur = (event: ChangeEvent<HTMLInputElement>, index: number) => {
        const numberValue: number = Number(event.target.value)
        const newData: string[] = [...data]
        if (isNaN(numberValue)) {
            newData[index] = '0'
            setData(newData)
        }

        onUpdate(stringArrayToVec3(newData))
    }

    const onChange = (event: ChangeEvent<HTMLInputElement>, index: number ) => {
        const numberValue: number = Number(event.target.value)
        const newData: string[] = [...data]
        newData[index] = event.target.value
        setData(newData)

        if (isNaN(numberValue)) return

        onUpdate(stringArrayToVec3(newData))
    }

    return (
        <div>
            <div>{dataLabel}</div>
            <div style={{display: 'flex', gap: '1rem', justifyContent: 'space-between'}}>
            <span>
                <label>x:</label>
                <input 
                    max={max}
                    min={min}
                    type='number'
                    step={step ?? 0.5}
                    value={data[0]} 
                    onChange={(event) => onChange(event, 0)}
                    onBlur={(event) => onBlur(event, 0)}
                    style={{width: '75px'}} 
                />
            </span>
            <span >
                <label>y:</label>
                <input
                    max={max}
                    min={min}
                    type='number'
                    step={step ?? 0.5}
                    value={data[1]} 
                    onChange={(event) => onChange(event, 1)}
                    onBlur={(event) => onBlur(event, 1)}
                    style={{width: '75px'}} 
                />
            </span>
            <span>
                <label>z:</label>
                <input 
                    max={max}
                    min={min}
                    type='number'
                    step={step ?? 0.5}
                    value={data[2]} 
                    onChange={(event) => onChange(event, 2)}
                    onBlur={(event) => onBlur(event, 2)}
                    style={{width: '75px'}} 
                />
            </span>
        </div>
        </div>
    )
}


interface TransformEditorProps {
    initialPosition: vec3
    initialRotation: vec3
    initialScale: vec3
    labelName: string
    onUpdate: (newPosition: vec3, newRotation: vec3, newScale: vec3) => void
}

export const TransformEditor: React.FC<TransformEditorProps> = ({
    initialPosition, 
    initialRotation,
    initialScale,
    labelName,
    onUpdate,
}) => {
    const [position, setPosition] = useState<vec3>(initialPosition)
    const [rotation, setRotation] = useState<vec3>(initialRotation)
    const [scale, setScale] = useState<vec3>(initialScale)

    const updatePosition = (newPosition: vec3) => {
        setPosition(newPosition)
        onUpdate(newPosition, rotation, scale)
    }

    const updateRotation = (newRotation: vec3) => {
        setRotation(newRotation)
        onUpdate(position, newRotation, scale)
    }

    const updateScale = (newScale: vec3) => {
        setScale(newScale)
        onUpdate(position, rotation, newScale)
    }

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            height: 'fit-content',
            gap: '0.5rem',
            padding: '0.5rem',
            margin: '0.5rem',
            border: '1px solid black',
            borderRadius: '0.5rem',
        }}>
            <div>{labelName}</div>
            <Vector3Editor 
                dataLabel='Position' 
                initialData={[initialPosition[0].toString(), initialPosition[1].toString(), initialPosition[2].toString()]} 
                onUpdate={updatePosition} 
            />
            <Vector3Editor 
                dataLabel='Rotation' 
                initialData={[initialRotation[0].toString(), initialRotation[1].toString(), initialRotation[2].toString()]} 
                onUpdate={updateRotation} 
            />
            <Vector3Editor
                dataLabel='Scale' 
                initialData={[initialScale[0].toString(), initialScale[1].toString(), initialScale[2].toString()]} 
                onUpdate={updateScale} 
            />
        </div>
    )
}

interface ColorEditorProps {
    initialColor: vec3
    onUpdate: (newColor: vec3) => void
}

export const ColorEditor: React.FC<ColorEditorProps> = ({initialColor, onUpdate}) => {

    const updateColor = (newColor: vec3) => {
        onUpdate(newColor)
    }

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            height: 'fit-content',
            gap: '0.5rem',
            padding: '0.5rem',
            margin: '0.5rem',
            border: '1px solid black',
            borderRadius: '0.5rem',
        }}>
            <Vector3Editor 
                dataLabel='Color (RGB [0-1]) ---- Ex. (1, 1, 1) = white' 
                initialData={[initialColor[0].toString(), initialColor[1].toString(), initialColor[2].toString()]} 
                onUpdate={updateColor} 
                step={0.1}
                min={0}
                max={1}
            />
        </div>
    )
}
