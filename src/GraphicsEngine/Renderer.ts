import { mat4 } from "gl-matrix";
import { Material } from "./Materials/Material";
import { ObjectRenderProps } from "./Object3D";
import { Model } from "./Model";

/*
 * Vertex Buffer Constants:
 * the array below is made up of model data like vertices, normals, and texture coords, 
 * it gets placed in a vertex buffer object and we can specify to webGL how it should
 * read the information from this array for each vertex, and bind it to an attribute 
 * in the vertex shader
 * 
 * [posX, posY, posZ, normX, normY, normX] 
 */

// Positions
const PositionBufferDataSize = 3
const PositionBufferDataOffset = 0

// Normals
const NormalBufferDataSize = 3
const NormalBufferDataOffset = 3 * Float32Array.BYTES_PER_ELEMENT

// The total size of one buffer "unit" (array seen above)
// The 6 will change as more data gets packed into the buffer
const BufferDataStride = 6 * Float32Array.BYTES_PER_ELEMENT


export interface RenderProperties extends ObjectRenderProps {
    modelMatrix: mat4
}

export class Renderer {
    private _gl: WebGL2RenderingContext
    private _model: Model
    private _material: Material

    constructor(gl: WebGL2RenderingContext, model: Model, material: Material) {
        this._gl = gl
        this._model = model
        this._material = material
    }

    public set material(mat: Material) {
        this._material = mat
    }

    /**
     * This function will be called on every render frame
     */
    public render(props: RenderProperties): void {
        this._material.use()
        this._material.run(props)

        // bind model vertices
        const vertexBuffer = this._gl.createBuffer()
        this._gl.bindBuffer(this._gl.ARRAY_BUFFER, vertexBuffer)
        this._gl.bufferData(this._gl.ARRAY_BUFFER, new Float32Array(this._model.vertexBufferData), this._gl.STATIC_DRAW)

        // set position attribute location
        this._material.setVertexAttribute('aPosition', PositionBufferDataSize, this._gl.FLOAT, false, BufferDataStride, PositionBufferDataOffset)
        this._material.setVertexAttribute('aNormal', NormalBufferDataSize, this._gl.FLOAT, false, BufferDataStride, NormalBufferDataOffset)
        // TODO -- could also set up the other attribute locations here too like texture etc -- 

        // bind model indices
        const indexBuffer = this._gl.createBuffer()
        this._gl.bindBuffer(this._gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
        this._gl.bufferData(this._gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this._model.indices), this._gl.STATIC_DRAW)

        this._gl.drawElements(this._gl.TRIANGLES, this._model.indices.length, this._gl.UNSIGNED_SHORT, 0)

        this._material.stopUse()
    }
}