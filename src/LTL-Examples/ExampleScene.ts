import { vec3, mat4, quat } from "gl-matrix";
import { lightVertexShader } from "../Assets/VertexShaders";
import { lightFragmentShader } from "../Assets/FragmentShaders";
import { ModelData } from "../GraphicsEngine/Model";
import { compileShader, createShaderProgram } from "../GraphicsEngine/ShaderUtils";
import { Projection } from "../GraphicsEngine/Scene";
import { Light } from "../GraphicsEngine/Light/Light";
import { Transform } from "../GraphicsEngine/Transform";

export class ExampleScene {
    // webGL data
    private gl: WebGL2RenderingContext
    private modelData: ModelData
    private shaderProgram: WebGLProgram | null = null
    private vertexBuffer: WebGLBuffer | null = null
    private indexBuffer: WebGLBuffer | null = null

    // object transform
    private position: vec3
    private rotation: quat
    private scale: vec3

    // object matrix data
    private modelMatrix: mat4
    private viewMatrix: mat4
    private projectionMatrix: mat4

    // Camera information
    private cameraPosition: vec3
    private cameraRotation: quat
    private canvasScale: number

    // light information
    private light: Light

    // demo info
    private customRenderCallback: ((timestamp: number) => void) | null = null
    private color: number[] = [0.25, 1.0, 0.75, 1.0]

    constructor(gl: WebGL2RenderingContext, canvasScale: number, projection: Projection, modelData: ModelData, modelTransform?: Transform, cameraTransform?: Transform, color?: vec3) {
        this.gl = gl

        // The cube model data is stored in Cube.ts
        //  You will see in the future demos that the data can also be stored in a file and imported
        this.modelData = modelData
        this.vertexBuffer = this.gl.createBuffer()
        this.indexBuffer = this.gl.createBuffer()

        // Place object at the origin with no rotation
        this.position = modelTransform ? modelTransform.position : vec3.create()
        this.rotation = modelTransform ? modelTransform.rotation : quat.fromEuler(quat.create(), 0, 45, 0)
        this.scale = modelTransform ? modelTransform.scale : vec3.fromValues(1, 1, 1)
        this.modelMatrix = mat4.fromRotationTranslationScale(mat4.create(), this.rotation, this.position, this.scale)

        // Camera setup
        this.cameraPosition = vec3.fromValues(0, 0, -3)
        this.cameraRotation =  quat.create()
        this.viewMatrix = mat4.fromRotationTranslation(mat4.create(), this.cameraRotation, this.cameraPosition)
        this.projectionMatrix = mat4.perspective(mat4.create(), projection.fovY, projection.aspectRatio, projection.near, projection.far)
        this.canvasScale = canvasScale

        // setup light using a class in my graphics engine to simplify this process since it is just vectors
        const lightDirection = vec3.fromValues(0.25, 1.0, 0.5)
        const lightAmbientColor = vec3.fromValues(0.5, 0.5, 0.5)
        const lightColor = vec3.fromValues(1.0, 1.0, 1.0)
        const luminosity = 1.0
        this.light = new Light(lightDirection, lightAmbientColor, lightColor, luminosity)
    }

    public start(customRenderCallback: (timestamp: number) => void | null): void {
        this.customRenderCallback = customRenderCallback

        // When the canvas is cleared on draw, this is the color it will be cleared to
        this.gl.clearColor(0.0, 0.0, 0.0, 1.0)
        this.gl.enable(this.gl.DEPTH_TEST)
        
        // allow the screen to scale and still render the content correctly
        this.handleResize = this.handleResize.bind(this)
        window.addEventListener('resize', this.handleResize)
        this.handleResize()
        
        // ----- Create shader program -----

        // light vertex shader is stored in VertexShaders.ts
        const vertexShaderSource: string = lightVertexShader
        
        // light fragment shader is stored in FragmentShaders.ts
        const fragmentShaderSource: string =  lightFragmentShader

        // Use my helper function from ShaderUtils.ts to compile shaders
        const vertexShader: WebGLShader = compileShader(this.gl, vertexShaderSource, this.gl.VERTEX_SHADER)
        const fragmentShader: WebGLShader = compileShader(this.gl, fragmentShaderSource, this.gl.FRAGMENT_SHADER)
        
        // Use the compiled vertex and fragment shaders to create a shader program
        //  this is also a helper function I created in ShaderUtils.ts
        this.shaderProgram = createShaderProgram(this.gl, vertexShader, fragmentShader)

        // assigns this shader program to the GPU to render with
        this.gl.useProgram(this.shaderProgram)

        // ----- Create vertex buffer object (VBO) -----
        this.setupBuffers()
        
        // ----- Render the model -----
        this.render(0)
    }

    private setupBuffers(): void {
        if (!this.shaderProgram) {
            throw new Error('shader program not initialized')
        }

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer)

        // Pass all the model vertexData (position, and normal direction) to the vertex buffer
        //  This copies over the vertex data to the GPU
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.getVertexBufferDataFromModelData()), this.gl.STATIC_DRAW)

        // Now crete the vertex attribute object (VAO) to tell the GPU how to read the VBO
        //  attributeLocation is a memory address on the GPU
        const positionAttributeLocation: number = this.gl.getAttribLocation(this.shaderProgram, 'aPosition')
        this.gl.enableVertexAttribArray(positionAttributeLocation)

        const normalAttributeLocation: number = this.gl.getAttribLocation(this.shaderProgram, 'aNormal')
        this.gl.enableVertexAttribArray(normalAttributeLocation)

        // This is what tells the GPU exactly how to read the VBO data
        //  https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/vertexAttribPointer
        
        const bufferDataStride = 6 * Float32Array.BYTES_PER_ELEMENT // 6 floats per vertex (3 positions, and 3 normals)
        const normalDataOffset = 3 * Float32Array.BYTES_PER_ELEMENT // tell the GPU that the normal data starts 3 floats after the position data

        this.gl.vertexAttribPointer(positionAttributeLocation, 3, this.gl.FLOAT, false, bufferDataStride, 0)
        this.gl.vertexAttribPointer(normalAttributeLocation, 3, this.gl.FLOAT, false, bufferDataStride, normalDataOffset)

        // Create something called an index buffer that specifies the order to draw the vertices and their attributes
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer)
        this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.modelData.indices), this.gl.STATIC_DRAW)
    }

    private setupModelMatrix(): void {
        this.modelMatrix = mat4.fromRotationTranslationScale(mat4.create(), this.rotation, this.position, this.scale)
    }

    // Assigns variables called uniforms to the shader
    //  These values will remain the constant throughout the shader pipeline
    private setupUniforms(): void {
        if (!this.shaderProgram) {
            throw new Error('shader program not initialized')
        }

        // These uniform variable names MUST match exactly how you wrote them in the shader or else nothing will render
        
        // give the MVP matrix information to the shader
        const modelMatrixLocation = this.gl.getUniformLocation(this.shaderProgram, 'uModelMatrix')
        this.gl.uniformMatrix4fv(modelMatrixLocation, false, this.modelMatrix)

        const viewMatrixLocation = this.gl.getUniformLocation(this.shaderProgram, 'uViewMatrix')
        this.gl.uniformMatrix4fv(viewMatrixLocation, false, this.viewMatrix)

        const projectionMatrixLocation = this.gl.getUniformLocation(this.shaderProgram, 'uProjectionMatrix')
        this.gl.uniformMatrix4fv(projectionMatrixLocation, false, this.projectionMatrix)
    
        // give the color to render the fragments to the shader
        const colorLocation = this.gl.getUniformLocation(this.shaderProgram, 'uColor')
        this.gl.uniform4fv(colorLocation, this.color)

        // give the light information to shader
        const lightDirectionLocation = this.gl.getUniformLocation(this.shaderProgram, 'uLightDirection')
        this.gl.uniform3fv(lightDirectionLocation, this.light.direction)

        const lightAmbientColorLocation = this.gl.getUniformLocation(this.shaderProgram, 'uAmbientColor')
        this.gl.uniform3fv(lightAmbientColorLocation, this.light.ambientColor)

        const lightColorLocation = this.gl.getUniformLocation(this.shaderProgram, 'uLightColor')
        this.gl.uniform3fv(lightColorLocation, this.light.color)
    }

    // Render function to be called from requestAnimationFrame
    private render(timestamp: number): void {
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT)

        if (this.customRenderCallback) {
            this.customRenderCallback(timestamp)
        }

        this.setupModelMatrix()
        this.setupUniforms()
        this.setupBuffers()

        // draw the object using the index buffer determining the order the vertices are drawn in
        //  in the setupBuffers() function this is setup so the GPU knows where to find the correct data to use
        this.gl.drawElements(this.gl.TRIANGLES, this.modelData.indices.length, this.gl.UNSIGNED_SHORT, 0)

        requestAnimationFrame(this.render.bind(this))
    }


    // Put the model data in a format that can be passed into the GPU
    private getVertexBufferDataFromModelData(): number[] {
        const bufferData = []
        for (let i = 0; i < this.modelData.vertices.length; i += 3) {
            bufferData.push(
                this.modelData.vertices[i],
                this.modelData.vertices[i + 1],
                this.modelData.vertices[i + 2],
                this.modelData.normals[i],
                this.modelData.normals[i + 1],
                this.modelData.normals[i + 2],
            )
        }

        return bufferData
    }

    private updateProjection(projection: Projection): void {
        this.projectionMatrix = mat4.perspective(mat4.create(), projection.fovY, projection.aspectRatio, projection.near, projection.far)
    }

    private handleResize = () => {
        const width = window.innerWidth / this.canvasScale
        const height = window.innerHeight / this.canvasScale
        const canvas = this.gl.canvas
        
        canvas.width = width
        canvas.height = height

        const aspectRatio = this.gl.canvas.width / this.gl.canvas.height
        const cameraProjection: Projection = {
            aspectRatio,
            fovY: 1.0472,
            near: 0.1,
            far: 1000
        }
        this.updateProjection(cameraProjection)

        this.gl.viewport(0, 0, width, height)
    }

    public updateCameraTransform(position?: vec3, rotation?: quat): void {
        this.cameraPosition = position ?? this.cameraPosition
        this.cameraRotation = rotation ?? this.cameraRotation
        this.viewMatrix = mat4.fromRotationTranslation(mat4.create(), this.cameraRotation, this.cameraPosition)
    }

    public updateModelTransform(position?: vec3, rotation?: quat, scale?: vec3): void {
        this.position = position ?? this.position
        this.rotation = rotation ?? this.rotation
        this.scale = scale ?? this.scale
    }

    public updateColor(color: vec3): void {
        this.color = [color[0], color[1], color[2], 1.0]
    }

    public updateModelData(modelData: ModelData): void {
        this.modelData = modelData
    }

    public rotateModel(rotate: vec3): void {
        const rotationQuat = quat.fromEuler(quat.create(), rotate[0], rotate[1], rotate[2])
        quat.multiply(this.rotation, this.rotation, rotationQuat)
    }

    public translateModel(translate: vec3): void {
        vec3.add(this.position, this.position, translate)
    }

    public scaleModel(scale: vec3): void {
        vec3.multiply(this.scale, this.scale, scale)
    }

    stop(): void {
        // this.gl.deleteBuffer(this.vertexBuffer)
        // this.gl.deleteBuffer(this.indexBuffer)
        // window.removeEventListener('resize', this.handleResize)
    }
}