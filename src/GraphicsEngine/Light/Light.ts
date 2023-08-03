import { vec3 } from "gl-matrix";

export class Light {
    private _direction: vec3
    private _ambientColor: vec3
    private _color: vec3
    private _luminosity: number

    constructor(direction?: vec3, ambientColor?: vec3, color?: vec3, luminosity?: number) {
        this._direction = direction ?? vec3.fromValues(0.0, -1.0, 0.0)
        this._ambientColor = ambientColor ?? vec3.fromValues(1.0, 1.0, 1.0)
        this._color = color ?? vec3.fromValues(1.0, 1.0, 1.0)
        this._luminosity = luminosity ?? 1.0
    }

    public get direction(): vec3 {
        return vec3.clone(this._direction)
    }

    public get ambientColor(): vec3 {
        return vec3.clone(this._ambientColor)
    }

    public get color(): vec3 {
        return vec3.clone(this._color)
    }

    public get luminosity(): number {
        return this._luminosity
    }
}