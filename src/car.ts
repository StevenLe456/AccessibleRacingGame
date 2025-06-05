import { Scene, Mesh, MeshBuilder, UniversalCamera, Vector3 } from "@babylonjs/core"
import { Color4 } from "babylonjs"

export class Car {
    private x
    private y
    private z
    private red
    private green
    private blue
    private scene
    private id
    private mesh: Mesh
    private cam: UniversalCamera

    constructor(x: number, y: number, z: number, r: number, g: number, b: number, s: Scene, id: string) {
        this.x = x
        this.y = y
        this.z = z
        this.red = r
        this.green = g
        this.blue = b
        this.scene = s
        this.id = id
        var c: Color4 = new Color4(this.red, this.green, this.blue, 1.0)
        this.mesh = MeshBuilder.CreateBox("car" + this.id, {width: 1, height: 1, depth: 3, faceColors: [c, c, c, c, c, c], updatable: true}, this.scene)
        this.mesh.position = new Vector3(this.x, this.y, this.z)
        this.cam = new UniversalCamera("cam" + id, new Vector3(this.x, this.y + 2, this.z - 10), this.scene)
    }

    update() {

    }
}