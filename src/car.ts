import { Scene, Mesh, UniversalCamera, Vector3, Viewport, PhysicsAggregate, PhysicsShapeType } from "@babylonjs/core"

export class Car {
    private x
    private y
    private z
    public rotation
    public velocity
    private scene
    private cvs_x
    private id
    private mesh: Mesh
    private cam: UniversalCamera
    private car_display
    public mass 
    public phys_aggr

    constructor(m: Mesh, x: number, y: number, z: number, s: Scene, cvs_x: number, id: string) {
        this.mesh = m
        m.position = new Vector3(x, y ,z)
        this.x = x
        this.y = y
        this.z = z
        this.rotation = 45
        this.velocity = 0.5
        this.scene = s
        this.cvs_x = cvs_x
        this.id = id
        this.cam = new UniversalCamera("cam" + this.id, new Vector3(this.x, this.y + 2, this.z - 10), this.scene)
        this.scene.activeCameras?.push(this.cam)
        this.cam.viewport = new Viewport(this.cvs_x, 0, 0.5, 1)
        this.car_display = <HTMLElement> document.getElementById("display")
        this.mass = 5 * Math.random()
        this.phys_aggr = new PhysicsAggregate(this.mesh, PhysicsShapeType.CONVEX_HULL, {mass: this.mass}, this.scene)
    }

    setMesh(m: Mesh) {
        this.mesh = m
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

    impulse(obj_velocity1: number, obj_velocity2: number, obj_mass: number, obj_rotation: number, elasticity: number) {
        let lhs = this.mass * this.velocity + obj_mass * obj_velocity1
        this.x += (lhs - (obj_velocity2 * obj_mass)) / this.mass * Math.sin(this.rotation + obj_rotation) * elasticity
        this.z += (lhs - (obj_velocity2 * obj_mass)) / this.mass * Math.cos(this.rotation + obj_rotation) * elasticity
    }
}