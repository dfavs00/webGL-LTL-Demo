import { compileShader, createShaderProgram } from "../ShaderUtils"
import { basicVertexShader } from "../../Assets/VertexShaders"
import { basicFragmentShader } from "../../Assets/FragmentShaders"
import { Material, UniformType } from "./Material"
import { RenderProperties } from "../Renderer"

export class BasicMaterial extends Material {
    private _color: number[]

    constructor(gl: WebGL2RenderingContext, color?: number[]) {
        super(gl)
        this._color = color ?? [1.0, 1.0, 1.0, 1.0] // default to white
    }

    setupShaderProgram(): WebGLProgram {
        // Right now I am just compiling the shaders in the material, ideally each shader is only
        //  compiled once and stored somewhere
        const vShader = compileShader(this._gl, basicVertexShader, this._gl.VERTEX_SHADER)
        const fShader = compileShader(this._gl, basicFragmentShader, this._gl.FRAGMENT_SHADER)
    
        return createShaderProgram(this._gl, vShader, fShader)
    }

    run(props: RenderProperties): void {
        // set uniforms
        this.setUniform('uModelMatrix', UniformType.MAT4, props.modelMatrix)
        this.setUniform('uViewMatrix', UniformType.MAT4, props.viewMatrix)
        this.setUniform('uProjectionMatrix', UniformType.MAT4, props.projectionMatrix)
        this.setUniform('uColor', UniformType.VEC4, this._color)
    }
}