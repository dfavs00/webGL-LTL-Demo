import { Light } from "./Light/Light";
import { Object3D, ObjectRenderProps } from "./Object3D";
import { Camera } from "./Camera/Camera";

export interface Projection {
    fovY: number
    aspectRatio: number
    near: number
    far: number
}

export class Scene {
    private _gl: WebGL2RenderingContext
    private _objects: Object3D[]
    private _light: Light
    private _camera: Camera 

    constructor(gl: WebGL2RenderingContext, objects: Object3D[], light: Light, camera: Camera) {
        this._gl = gl
        this._objects = objects
        this._light = light
        this._camera = camera
    }

    public get camera(): Camera {
        return this._camera
    }

    public set camera(camera: Camera) {
        this._camera = camera
    }

    public get objects(): Object3D[] {
        return this._objects
    }

    /**
     * @summary Renders all objects in this scene
     */
    public render(): void {
        this._gl.clear(this._gl.COLOR_BUFFER_BIT | this._gl.DEPTH_BUFFER_BIT)
        this._objects.forEach((object: Object3D) => {
            object.render({
                projectionMatrix: this._camera.projectionMatrix,
                viewMatrix: this._camera.viewMatrix,
                light: this._light,
            } as ObjectRenderProps)
        })
    }
}