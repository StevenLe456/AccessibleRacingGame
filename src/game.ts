import { Engine, Scene, Vector3, HemisphericLight, Mesh, MeshBuilder, ShaderMaterial, ImportMeshAsync, BoundingBox} from "@babylonjs/core"
import 'babylonjs-loaders'
import { registerBuiltInLoaders } from "@babylonjs/loaders/dynamic"
import { Car } from "./car"
import { InputHandler } from "./input"
import { Head } from "./head"
import * as faceDetection from '@tensorflow-models/face-detection';
import { Entity } from "./entity"
import { collisionAABB } from "./physics"

class GameObj {
    public camvas: HTMLCanvasElement
    public engine: Engine
    public scene: Scene
    public car1: Car
    public car2: Car
    public guardrails: Entity[]
    public obstacles: Entity[]
    public head1: Head
    public inputty: InputHandler

    constructor(cam: HTMLCanvasElement, e: Engine, s: Scene, c1: Car, c2: Car, gr: Entity[], o: Entity[], h1: Head, i: InputHandler) {
        this.camvas = cam
        this.engine = e
        this.scene = s
        this.car1 = c1
        this.car2 = c2
        this.guardrails = gr
        this.obstacles = o
        this.head1 = h1
        this.inputty = i
    }
}

async function initGame(h1: Head, model: Promise<faceDetection.FaceDetector> , webcam: HTMLVideoElement, cam: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
    // get canvas
    let canvas = <HTMLCanvasElement> document.getElementById("gameCanvas")
    let camvas = cam

    // initialize babylon scene and engine
    let engine = new Engine(canvas, true)
    let scene = new Scene(engine)

    // add stuff to scene
    registerBuiltInLoaders()
    let mesh1 = <Mesh> (await ImportMeshAsync("models/car1.obj", scene)).meshes[0]
    let mesh2 = <Mesh> (await ImportMeshAsync("models/car2.obj", scene)).meshes[0]
    mesh1.rotate(new Vector3(0, 1, 0), -Math.PI)
    mesh1.refreshBoundingInfo()
    mesh1.computeWorldMatrix(true)
    mesh2.rotate(new Vector3(0, 1, 0), -Math.PI)
    mesh2.refreshBoundingInfo()
    mesh2.computeWorldMatrix(true)
    let car1 = new Car(mesh1, -20, 0, 0, scene, 0, "1")
    let car2 = new Car(mesh2, 20, 0, 0, scene, 0.5, "2")
    
    var track: Mesh = MeshBuilder.CreateBox("racetrack", {width: 120, height: 0.01, depth: 10000})
    track.position = new Vector3(0, -0.005, 4900)
    var gr1_m: Mesh = MeshBuilder.CreateBox("gaurdrail1", {width: 4, height: 4, depth: 10000})
    gr1_m.position = new Vector3(-62, 2, 4900)
    var gr2_m: Mesh = MeshBuilder.CreateBox("gaurdrail2", {width: 4, height: 4, depth: 10000})
    gr2_m.position = new Vector3(62, 2, 4900)
    let gr = [new Entity(gr1_m), new Entity(gr2_m)]

    let o: Entity[] = []
    for (let i = 200; i < 9000; i+=200) {
        let poptart_mesh = <Mesh> (await ImportMeshAsync("models/poptart.obj", scene)).meshes[0]
        poptart_mesh.rotate(new Vector3(0, 1, 0), -Math.PI)
        poptart_mesh.scaling = new Vector3(10, 4, 4)
        poptart_mesh.position = new Vector3(Math.random() * (80 + 1) - 40, 0, i)
        o.push(new Entity(poptart_mesh))
    }

    var light1: HemisphericLight = new HemisphericLight("light1", new Vector3(1, 1, 0), scene)

    // initialize input handler
    let inputty = new InputHandler(model, webcam, ctx)
    let head1 = h1

    // add shader and attach it to road
    var rainbowMaterial = new ShaderMaterial("rainbow_road", scene, "./rainbow",
    {
        attributes: ["position"],
        uniforms: ["worldViewProjection"]
    })
    track.material = rainbowMaterial

    return new GameObj(cam, engine, scene, car1, car2, gr, o, head1, inputty)
}

export function game(h1: Head, model: Promise<faceDetection.FaceDetector> , webcam: HTMLVideoElement, cam: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
    initGame(h1, model, webcam, cam, ctx).then((g) => {
        let camvas = g.camvas
        let engine = g.engine
        let scene = g.scene
        let car1 = g.car1
        let car2 = g.car2
        let guardrails = g.guardrails
        let obstacles = g.obstacles
        let head1 = g.head1
        let inputty = g.inputty

        // run the main render loop
        engine.runRenderLoop(() => {
            // handle input
            inputty.update(camvas, head1)
            inputty.handle_input(car1)
            // function to check for car-entity collision
            function carEntityCollide(car: Car, gr: Entity) {
                let dx = car.x - car.px
                let dy = car.y - car.py
                let dz = car.z - car.pz
                return collisionAABB(car.bb, gr.bounding_box, dx, dy, dz)
            }
            // function to check for car-car collision
            function carCarCollide(c1: Car, c2: Car) {
                let dx = (c1.x - c1.px) - (c2.x - c2.px)
                let dy = (c1.y - c1.py) - (c2.y - c2.py)
                let dz = (c1.z - c1.pz) - (c2.z - c2.pz)
                return collisionAABB(c1.bb, c2.bb, dx, dy, dz)
            }
            // car-car check
            let r
            r = carCarCollide(car1, car2)
            if (r["h"] < 1) { // If there is collision between car1 and car2
                var ep = 0.001;
                car1.x = car1.px + r.h*(car1.x-car1.px) + ep*r.nx;
                car1.y = car1.py + r.h*(car1.y-car1.py) + ep*r.ny;
                car1.z = car1.pz + r.h*(car1.z-car1.pz) + ep*r.nz;
                car1.bounce()
                car2.bounce()
            }
            // car1-guardrail check
            if (car1.px < 0) {
                r = carEntityCollide(car1, guardrails[0])
            }
            else {
                r = carEntityCollide(car1, guardrails[1])
            }
            if (r["h"] < 1) { // If there is collision between car1 and a guardrail
                var ep = 0.001;
		        car1.x = car1.px + r.h*(car1.x-car1.px) + ep*r.nx;
		        car1.y = car1.py + r.h*(car1.y-car1.py) + ep*r.ny;
		        car1.z = car1.pz + r.h*(car1.z-car1.pz) + ep*r.nz;
                car1.bounce()
            }
            // car2-guardrail check
            if (car2.px < 0) {
                r = carEntityCollide(car2, guardrails[0])
            }
            else {
                r = carEntityCollide(car2, guardrails[1])
            }
            if (r["h"] < 1) { // If there is collision between car2 and a guardrail
                var ep = 0.001;
		        car2.x = car2.px + r.h*(car2.x-car2.px) + ep*r.nx;
		        car2.y = car2.py + r.h*(car2.y-car2.py) + ep*r.ny;
		        car2.z = car2.pz + r.h*(car2.z-car2.pz) + ep*r.nz;
                car2.bounce()
            }
            // car1-obstacle check
            if (car1.pz >= 200 && car1.pz < 9000) {
                let idx = Math.floor(car1.pz / 200.0) - 1
                r = carEntityCollide(car1, obstacles[idx])
                if (r["h"] < 1) { // If there is collision between car1 and an obstacle
                    var ep = 0.001;
                    car1.x = car1.px + r.h*(car1.x-car1.px) + ep*r.nx;
                    car1.y = car1.py + r.h*(car1.y-car1.py) + ep*r.ny;
                    car1.z = car1.pz + r.h*(car1.z-car1.pz) + ep*r.nz;
                    car1.bounce()
                }
            }
            // car2-obstacle check
            if (car2.pz >= 200 && car2.pz < 9000) {
                let idx = Math.floor(car2.pz / 200.0) - 1
                r = carEntityCollide(car2, obstacles[idx])
                if (r["h"] < 1) { // If there is collision between car2 and an obstacle
                    var ep = 0.001;
                    car2.x = car2.px + r.h*(car2.x-car2.px) + ep*r.nx;
                    car2.y = car2.py + r.h*(car2.y-car2.py) + ep*r.ny;
                    car2.z = car2.pz + r.h*(car2.z-car2.pz) + ep*r.nz;
                    car2.bounce()
                }
            }
            // update game state
            car1.update()
            car2.update()
            // render game
            scene.render()
        })
    })
}