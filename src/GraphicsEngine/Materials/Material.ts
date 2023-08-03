import { RenderProperties } from "../Renderer"

export enum UniformType {
    FLOAT,
    VEC3,
    VEC4,
    MAT4,
}

export abstract class Material {
    protected _gl: WebGL2RenderingContext
    protected _shaderProgram: WebGLProgram

    constructor(gl: WebGL2RenderingContext) {
        this._gl = gl
        this._shaderProgram = this.setupShaderProgram()
    }

    /*
     * Sets up the shader program
     */
    abstract setupShaderProgram(): WebGLProgram

    /*
     * Runs material and sends data to shader. This is run on every re-render
     */
    abstract run(props: RenderProperties): void

    protected setUniform(name: string, type: UniformType, value: any) {
        const location = this._gl.getUniformLocation(this._shaderProgram, name)

        switch(type) {
            case UniformType.FLOAT:
                this._gl.uniform1f(location, value)
                break
            case UniformType.VEC3:
                this._gl.uniform3fv(location, value)
                break
            case UniformType.VEC4:
                this._gl.uniform4fv(location, value)
                break
            case UniformType.MAT4:
                this._gl.uniformMatrix4fv(location, false, value)
                break
        }
    }

    public setVertexAttribute(name: string, size: number, type: number, normalize: boolean, stride: number, offset: number) {
        const location = this._gl.getAttribLocation(this._shaderProgram, name)
        this._gl.enableVertexAttribArray(location)
        this._gl.vertexAttribPointer(location, size, type, normalize, stride, offset)
    }

    public use() {
        this._gl.useProgram(this._shaderProgram)
    }

    public stopUse() {
        this._gl.useProgram(null)
    }
}