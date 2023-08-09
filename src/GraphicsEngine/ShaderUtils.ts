/**
 * 
 * @param gl the current WebGL2RenderingContext
 * @param vShader a compiled vertex shader
 * @param fShader a compiled fragment shader
 * @returns a successfully linked shader program
 */
export const createShaderProgram = (gl: WebGL2RenderingContext, vShader: WebGLShader, fShader: WebGLShader): WebGLProgram => {
    const program = gl.createProgram()
    if (!program) {
        throw new Error('Unable to create shader program')
    }

    gl.attachShader(program, vShader)
    gl.attachShader(program, fShader)
    gl.linkProgram(program)
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error('Shader program linking error:', gl.getProgramInfoLog(program));
        throw new Error('unable to link shader program')
    }

    // create and link shader program
    return program
}

/**
 * @summary Returns a compiled shader given shader source code and type
 * @param shaderSource shader code as a string
 * @param type the type of shader (ex. gl.VERTEX_SHADER, gl.FRAGMENT_SHADER)
 * @returns A new compiled webgl shader if the shaderSource was compiled properly
 */
export const compileShader = (gl: WebGL2RenderingContext, shaderSource: string, type: number): WebGLShader => {
    const shader = gl.createShader(type)
    if (!shader) {
        throw new Error('failed to create shader')
    }

    gl.shaderSource(shader, shaderSource)
    gl.compileShader(shader)

    // verify the shader compiled properly
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('shader compilation failed:', gl.getShaderInfoLog(shader));
        throw new Error('shader compilation failed')
    }

    return shader
}