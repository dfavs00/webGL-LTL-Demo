export interface ModelData {
    /*
     * A continuous list of vertices in groups of three (x, y, z) representing
     * all of the corners of a model
     */
    vertices: number[]
    
    /*
     * A continuous list of normal unit vectors in groups of three (x, y, z) representing
     * the normal direction of a face specified by the indices array
     */
    normals: number[]
    
    /*
     * A continuous list of texture coordinates in groups of two (u, v) values ranging from 0 to 1 representing
     * where (0,0) represents the bottom-left corner of a texture (usually an image) and (1, 1) represents
     * the top-right corner of a texture
     */
    textureCoords: number[]
    
    /* 
     * A continuous list of indices that represent the order in which to iterate through the vertices, normals, and texture coordinates
     * each group of 3 numbers in the indices array represents one triangle face of the model
     */
    indices: number[]
}

export class Model {
    private _modelData: ModelData

    constructor(modelData: ModelData) {
        this._modelData = modelData
    }

    // eventually update this to have uv coords as well (or other things like bump maps etc...)
    public get vertexBufferData(): number[] {
        const bufferData = []
        for (let i = 0; i < this._modelData.vertices.length; i += 3) {
            bufferData.push(
                this._modelData.vertices[i],
                this._modelData.vertices[i + 1],
                this._modelData.vertices[i + 2],
                this._modelData.normals[i],
                this._modelData.normals[i + 1],
                this._modelData.normals[i + 2],
            )
        }

        return bufferData
    }
    
    public get vertices(): number[] {
        return this._modelData.vertices
    }

    public get normals(): number[] {
        return this._modelData.normals
    }

    public get textureCoords(): number[] {
        return this._modelData.textureCoords
    }

    public get indices(): number[] {
        return this._modelData.indices
    }
}

/**
 * @summary Parses an obj file and returns a new Model from its contents
 * @param objString obj file contents 
 * @returns new model from parsed objString
 */
export const parseOBJ = (objString: string): Model => {
    const vertices: number[] = []
    const normals: number[] = []
    const textureCoords: number[] = []
    const indices: number[] = []

    const objData = objString.split('\n')

    // Assume each line in the OBJ file starts with 'v', 'vn', 'vt', or 'f'
    // v - vertex, vn - vertex normal, vt - vertex texture, f - face (indices)
    objData.forEach((line) => {
        const parts = line.split(' ')

        if (parts[0] === 'v') {
        // Parse vertex positions
        const x = parseFloat(parts[1])
        const y = parseFloat(parts[2])
        const z = parseFloat(parts[3])
        vertices.push(x, y, z)
        } else if (parts[0] === 'vn') {
        // Parse normal vectors
        const nx = parseFloat(parts[1])
        const ny = parseFloat(parts[2])
        const nz = parseFloat(parts[3])
        normals.push(nx, ny, nz)
        } else if (parts[0] === 'vt') {
        // Parse texture coordinates
        const u = parseFloat(parts[1])
        const v = parseFloat(parts[2])
        textureCoords.push(u, v);
        } else if (parts[0] === 'f') {
            // Parse face indices - account for indices starting at 1 in .obj files
            for (let i = 1; i < 4; i++) {
                const faceVertex = parts[i].split('/')
                // only use the vertex indices for now
                const vertexIndex = parseInt(faceVertex[0]) - 1
                indices.push(vertexIndex)
            }
        }   
    })

    const modelData: ModelData = {
        vertices, 
        normals, 
        textureCoords, 
        indices
    }

    return new Model(modelData)
}