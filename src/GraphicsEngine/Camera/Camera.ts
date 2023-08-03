import { mat4 } from "gl-matrix";
import { Projection } from "../Scene";
import { Transform } from "../Transform";

export class Camera {
    private _transform: Transform
    private _viewMatrix: mat4
    private _projection: Projection
    private _projectionMatrix: mat4

    constructor(transform: Transform, projection: Projection) {
        this._transform = transform
        this._viewMatrix = mat4.fromRotationTranslation(mat4.create(), transform.rotation, transform.position)
        this._projection = projection
        this._projectionMatrix = mat4.perspective(mat4.create(), projection.fovY, projection.aspectRatio, projection.near, projection.far)
    }

    public get viewMatrix(): mat4 {
        return mat4.clone(this._viewMatrix)
    }

    public get projectionMatrix(): mat4 {
        return mat4.clone(this._projectionMatrix)
    }
    
    public get transform(): Transform {
        return this._transform
    }

    public set transform(transform: Transform) {
        this._transform = transform
        this._viewMatrix = mat4.fromRotationTranslation(mat4.create(), transform.rotation, transform.position)
    }

    public set projection(projection: Projection) {
        this._projection = projection
        this._projectionMatrix = mat4.perspective(mat4.create(), projection.fovY, projection.aspectRatio, projection.near, projection.far)
    }
}