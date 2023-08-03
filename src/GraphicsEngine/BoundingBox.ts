import { vec3 } from "gl-matrix"

/**
 * A class representing a bounding box around an Object3D
 * This allows for ray cast and collision detection
 */
export class BoundingBox {
    private _dimensions: vec3 // x-width, y-height, z-length
    private _halfx: number
    private _halfy: number
    private _halfz: number

    constructor(dimensions: vec3) {
        this._dimensions = dimensions
        this._halfx = dimensions[0] / 2
        this._halfy = dimensions[1] / 2
        this._halfz = dimensions[2] / 2
    }

    // /**
    //  * @param vec3 point (x, y, z)
    //  * @returns true if a point is within the bounding box
    //  */
    // isPointInside(point: vec3): boolean {

    // }

    // /**
    //  * @param b other bounding box
    //  * @returns true if bounding box is intersecting with this bounding box
    //  */
    // isBoxInside(b: BoundingBox): boolean {

    // }

    // might not need this?
    // doesRayIntersect(ray: vec3): boolean {

    // }
}