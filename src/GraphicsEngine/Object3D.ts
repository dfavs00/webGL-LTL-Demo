import { mat4 } from "gl-matrix"
import { Renderer } from "./Renderer"
import { Light } from "./Light/Light"
import { Transform } from "./Transform"

/* Next Steps:
    - Add texture to the shader (will need texCoords and cube normals)
        - same as above, figure out texture stuff again

    - Add Raycasting
        - Bounding boxes around object3Ds
        - Think about how to do this
*/

export interface ObjectRenderProps {
    viewMatrix: mat4
    projectionMatrix: mat4
    light: Light
}

export class Object3D {
    private _gl: WebGL2RenderingContext
    private _parent: Object3D | null
    private _renderer: Renderer
    private _transform: Transform
    private _children: Object3D[]

    constructor(gl: WebGL2RenderingContext, renderer: Renderer, children?: Object3D[], transform?: Transform) {
        this._gl = gl
        this._renderer = renderer
        this._transform = transform ?? new Transform()
        this._parent = null

        children?.forEach((child: Object3D) => {
            child.setParent(this)
        })
        this._children = children ?? []
        
    }

    public getChildByIndex(index: number): Object3D {
        return this._children[index]
    }

    public get transform(): Transform {
        return this._transform
    }

    public get renderer(): Renderer {
        return this._renderer
    }

    private setParent(parent: Object3D): void {
        this._parent = parent
    }

    public render(props: ObjectRenderProps) {

        var modelMatrix: mat4 = mat4.create()
        if (this._parent) {
            mat4.multiply(modelMatrix, this._parent.transform.matrix, this.transform.matrix)
        } else {
            modelMatrix = this.transform.matrix
        }

        // Render the object
        this._renderer.render({
            modelMatrix,
            ...props
        })

        // eventually render its children objects here
        this._children.forEach((child: Object3D) => {
            child.render(props)
        })
    }
}