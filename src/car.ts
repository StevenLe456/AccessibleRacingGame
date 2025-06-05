import { Scene, Mesh, MeshBuilder, UniversalCamera } from "@babylonjs/core"

class Car {
    private x
    private y
    private z
    private red
    private green
    private blue
    private scene
    private id

    constructor(x: number, y: number, z: number, r: number, g: number, b: number, s: Scene, id: string) {
        this.x = x
        this.y = y
        this.z = z
        this.red = r
        this.green = g
        this.blue = b
        this.scene = s
        this.id = id
    }
}