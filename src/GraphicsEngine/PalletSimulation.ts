import { glMatrix, quat, vec3 } from "gl-matrix"
import { CubeModelData } from "../Assets/Cube"
import { base } from "../BoxConfig"
import { LightMaterial } from "./Materials/LightMaterial"
import { Model } from "./Model"
import { Object3D } from "./Object3D"
import { Renderer } from "./Renderer"
import { Projection, Scene } from "./Scene"
import { Light } from "./Light/Light"
import { Camera } from "./Camera/Camera"
import { Transform } from "./Transform"
import { MouseEvent } from "react"

/**
 * @summary class to run a pallet simulation and directly be called by the frontend framework
 */
export class PalletSimulation {
    static readonly rotationSpeed: number = 2.0 // degrees
    static readonly rotationSensitivity: number = 0.15

    private _gl: WebGL2RenderingContext
    private _scene: Scene

    private _baseObjectRotation: quat
    private _baseObject: Object3D | null

    // screen dragging variablees
    private _isDragging: boolean = false
    private _lastMouseX: number = 0
    private _lastMouseY: number = 0

    private _selectedBoxIndex: number = 0
    
    // materials
    private _boxMat: LightMaterial
    private _baseMat: LightMaterial
    private _highlightMat : LightMaterial

    constructor(gl: WebGL2RenderingContext, boxTransforms: Transform[]) {
        this._gl = gl
        this._baseObjectRotation = quat.fromEuler(quat.create(), 0, 45, 0)
        this._baseObject = null

        // create materials
        const lightBrown = [0.480, 0.368, 0.264, 1.0]
        this._boxMat = new LightMaterial(this._gl, lightBrown)

        const gray = [0.3, 0.3, 0.4, 1.0]
        this._baseMat = new LightMaterial(this._gl, gray)

        const lightBlue = [0.48, 0.77, 0.75, 1.0]
        this._highlightMat = new LightMaterial(this._gl, lightBlue)

        this._scene = this.setupScene(boxTransforms)
        this.render = this.render.bind(this)

        this.setSelectedBoxIndex = this.setSelectedBoxIndex.bind(this)
        this.setSelectedBoxIndex(0)
    }

    private setupScene(boxTransforms: Transform[]): Scene {
        
        // set clear color to black
        this._gl.clearColor(0.0, 0.0, 0.0, 1.0)

        // enable depth testing
        this._gl.enable(this._gl.DEPTH_TEST)

        // generate the scene objects
        const sceneObjects = this.createSceneObjects(boxTransforms)
        
        // Create Directional Light
        const lightDirection = vec3.fromValues(0.25, 1.0, 0.5)
        const lightAmbientColor = vec3.fromValues(0.5, 0.5, 0.5)
        const lightColor = vec3.fromValues(1.0, 1.0, 1.0)
        const luminosity = 1.0
        const light = new Light(lightDirection, lightAmbientColor, lightColor, luminosity)

        // Create Camera
        const cameraTransform: Transform = new Transform(
            vec3.fromValues(-0.0, -40.0, -120),
            quat.fromEuler(quat.create(), 15, 0, 0)
        )
        const aspectRatio = this._gl.canvas.width / this._gl.canvas.height
        const cameraProjection: Projection = {
            aspectRatio,
            fovY: 1.0472,
            near: 0.1,
            far: 1000
        }
        const camera = new Camera(cameraTransform, cameraProjection)

        // create the scene
        return new Scene(this._gl, sceneObjects, light, camera)
    }

    public begin(): void {
        // add event listeners
        this.handleResize = this.handleResize.bind(this)
        window.addEventListener('resize', this.handleResize)

        this.handleResize()

        requestAnimationFrame(this.render)
    }

    public stop(): void {
        // clean up if necessary
        window.removeEventListener('resize', this.handleResize)
    }

    private render(timestamp: number) {
        this._scene.render()
        requestAnimationFrame(this.render)
    }

    private createSceneObjects(boxTransforms: Transform[]): Object3D[] {
        const sceneObjects: Object3D[] = []
        const cubeModel = new Model(CubeModelData)

        const boxes: Object3D[] = []
        boxTransforms.forEach((box: Transform) => {
            const boxTransform = new Transform(
                // y position adjustment -> position of the center of the box + half height of base + half height of box, divide this by the scale of the base
                vec3.fromValues(
                    box.position[0] / base.scale[0],
                    (box.scale[1] / 2 + box.position[1] + base.scale[1] / 2) / base.scale[1],
                    box.position[2] / base.scale[2],
                ),
                // rotation remains the same
                box.rotation,
                // adjust the scale of the boxes so that they are not effected by the scaled up base
                // This needs to happen because I am using the same 1x1x1 model and scaling them to account for different sizes
                vec3.fromValues(box.scale[0]/base.scale[0], box.scale[1]/base.scale[1], box.scale[2]/base.scale[2])
            )
            const boxObj = new Object3D(this._gl, new Renderer(this._gl, cubeModel,  this._boxMat), [], boxTransform)
            
            boxes.push(boxObj)
        })

        this._baseObject = new Object3D(this._gl, new Renderer(this._gl, cubeModel, this._baseMat), boxes, base)
        this._baseObject.transform.rotation = this._baseObjectRotation

        sceneObjects.push(this._baseObject)

        return sceneObjects
    }

    public handleResize = () => {
        const width = window.innerWidth / 2
        const height = window.innerHeight / 1.2
        const canvas = this._gl.canvas
        
        canvas.width = width
        canvas.height = height

        const aspectRatio = this._gl.canvas.width / this._gl.canvas.height
        const cameraProjection: Projection = {
            aspectRatio,
            fovY: 1.0472,
            near: 0.1,
            far: 1000
        }
        this._scene.camera.projection = cameraProjection

        this._gl.viewport(0, 0, width, height)
    }

    public handleMouseDown = (event: MouseEvent) => {
        this._isDragging = true
        this._lastMouseX = event.clientX
        this._lastMouseY = event.clientY
    }

    public handleMouseMove = (event: MouseEvent) => {
        if (!this._isDragging) {
            return
        }

        const deltaX = event.clientX - this._lastMouseX
        // const deltaY = event.clientY - this._lastMouseY

        if (this._baseObject) {
            this._baseObject.transform.rotation = quat.rotateY(quat.create(), this._baseObject.transform.rotation, glMatrix.toRadian(deltaX * PalletSimulation.rotationSensitivity))
        }

        // maybe move the camera up and down a little based on the delta-y but clamp between 2 values
        this._lastMouseX = event.clientX
        this._lastMouseY = event.clientY
    }

    public handleMouseLeave = (event: MouseEvent) => {
        this._isDragging = false
    }

    public handleMouseUp = (event: MouseEvent) => {
        this._isDragging = false
    }

    public setSelectedBoxIndex(index: number) {
        this._scene.objects[0].getChildByIndex(this._selectedBoxIndex).renderer.material = this._boxMat
        this._scene.objects[0].getChildByIndex(index).renderer.material = this._highlightMat
        this._selectedBoxIndex = index
    }
}