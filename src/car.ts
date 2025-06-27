import { Scene, Mesh, UniversalCamera, Vector3, Viewport } from "@babylonjs/core"

export class Car {
    private x
    private y
    private z
    private checkpoint
    public rotation
    public velocity
    private scene
    private cvs_x
    private id
    private mesh: Mesh
    private cam: UniversalCamera
    private car_display
    public bb

    constructor(m: Mesh, x: number, y: number, z: number, s: Scene, cvs_x: number, id: string) {
        this.mesh = m
        m.position = new Vector3(x, y ,z)
        this.x = x
        this.y = y
        this.z = z
        this.checkpoint = z
        this.rotation = 0
        this.velocity = 0.5
        this.scene = s
        this.cvs_x = cvs_x
        this.id = id
        this.cam = new UniversalCamera("cam" + this.id, new Vector3(this.x, this.y + 2, this.z - 10), this.scene)
        this.scene.activeCameras?.push(this.cam)
        this.cam.viewport = new Viewport(this.cvs_x, 0, 0.5, 1)
        this.car_display = <HTMLElement> document.getElementById("display")
        this.bb = this.mesh.getBoundingInfo().boundingBox
        this.mesh.showBoundingBox = true
    }

    setMesh(m: Mesh) {
        this.mesh = m
    } 

    update() {
        this.x += this.velocity * Math.sin(this.rotation)
        this.z += this.velocity * Math.cos(this.rotation)
        this.checkpoint = this.z
        this.mesh.rotation = new Vector3(0, this.rotation, 0)
        this.mesh.position = new Vector3(this.x, this.y, this.z)
        this.cam.position = new Vector3(this.x, this.y + 2, this.z - 10)
        this.mesh.refreshBoundingInfo()
        this.mesh.computeWorldMatrix(true)
        this.car_display.innerHTML = "Velocity: " + this.velocity.toFixed(2)
    }

    turn_left() {
        this.rotation -= 0.005
    }

    turn_right() {
        this.rotation += 0.005
    }

    accelerate() {
        this.velocity += 0.01
    }

    decelerate() {
        this.velocity -= 0.01
    }

    on_track() {
        return this.x > -65 && this.x < 65
    }

    apply_gravity() {
        this.y -= 2
    }

    rock_bottom() {
        return this.y < -240
    }

    to_checkpoint() {
        this.x = -20
        this.y = 0
        this.z = this.checkpoint
    }
}