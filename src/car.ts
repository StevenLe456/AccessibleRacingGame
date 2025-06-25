import { Scene, Mesh, UniversalCamera, Vector3, Viewport, ImportMeshAsync, MeshBuilder, Color4 } from "@babylonjs/core"
import 'babylonjs-loaders'

export class Car {
    private x
    private y
    private z
    private rotation
    private velocity
    private scene
    private cvs_x
    private id
    private mesh: Mesh
    private cam: UniversalCamera
    private car_display 

    constructor(x: number, y: number, z: number, s: Scene, cvs_x: number, id: string) {
        this.x = x
        this.y = y
        this.z = z
        this.rotation = 0
        this.velocity = 0.5
        this.scene = s
        this.cvs_x = cvs_x
        this.id = id
        var c: Color4 = new Color4(0.0, 0.0, 0.0, 1.0)
        this.mesh = MeshBuilder.CreateBox("car" + this.id, {width: 1, height: 1, depth: 3, faceColors: [c, c, c, c, c, c], updatable: true}, this.scene)
        ImportMeshAsync("models/rainbow_car.obj", this.scene).then((scene) => {
            this.mesh = <Mesh> scene.meshes[0]
            this.mesh.position = new Vector3(this.x, this.y, this.z)
        })
        this.cam = new UniversalCamera("cam" + id, new Vector3(this.x, this.y + 2, this.z - 10), this.scene)
        this.scene.activeCameras?.push(this.cam)
        this.cam.viewport = new Viewport(this.cvs_x, 0, 0.5, 1)
        this.car_display = <HTMLElement> document.getElementById("display")
    }

    update() {
        this.x += this.velocity * Math.sin(this.rotation)
        this.z += this.velocity * Math.cos(this.rotation)
        this.mesh.rotation = new Vector3(0, this.rotation, 0)
        this.mesh.position = new Vector3(this.x, this.y, this.z)
        this.cam.position = new Vector3(this.x, this.cam.position.y, this.z - 10)
        this.car_display.innerHTML = "Velocity: " + this.velocity.toFixed(2)
    }

    turn_left() {
        this.rotation -= 0.005
    }

    turn_right() {
        this.rotation += 0.005
    }

    accelerate() {
        this.velocity += 0.005
    }

    decelerate() {
        this.velocity -= 0.005
    }
}