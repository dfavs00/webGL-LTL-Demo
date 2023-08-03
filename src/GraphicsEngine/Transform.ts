import { mat4, quat, vec3 } from "gl-matrix"

export class Transform {
    private _position: vec3
    private _rotation: quat
    private _scale: vec3
    private _transform: mat4

    constructor(position?: vec3, rotation?: quat, scale?: vec3) {
        this._position = position ?? vec3.fromValues(0, 0, 0)
        this._rotation = rotation ?? quat.create()
        this._scale = scale ?? vec3.fromValues(1, 1, 1)
        this._transform = this.getTransformMatrix()
    }

    public get position(): vec3 {
        return vec3.clone(this._position)
    }

    public set position(pos: vec3) {
        this._position = pos
        this._transform = this.getTransformMatrix()    
    }

    public get rotation(): quat {
        return quat.clone(this._rotation)
    }

    public set rotation(rot: quat) {
        this._rotation = rot
        this._transform = this.getTransformMatrix()    
    }

    public get scale(): vec3 {
        return vec3.clone(this._scale)
        
    }

    public set scale(sca: vec3) {
        this._scale = sca
        this._transform = this.getTransformMatrix()
    }

    public get matrix(): mat4 {
        return this._transform
    }

    // can eventually add in functions to translate, rotate, etc ...

    private getTransformMatrix(): mat4 {
        return mat4.fromRotationTranslationScale(mat4.create(), this._rotation, this._position, this._scale)
    }
}