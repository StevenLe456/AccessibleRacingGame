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
    mesh2.rotate(new Vector3(0, 1, 0), Math.PI)
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
        let head1 = g.head1
        let inputty = g.inputty

        // run the main render loop
        engine.runRenderLoop(() => {
            // handle input
            inputty.update(camvas, head1)
            inputty.handle_input(car1)
            // function to check for car-guardrail collision
            function carGuardrailCollide(car: Car, gr: Entity) {
                let dx = car.x - car.px
                let dy = car.y - car.py
                let dz = car.z - car.pz
                return collisionAABB(car.bb, gr.bounding_box, dx, dy, dz)
            }
            // car1-guardrail check
            let r
            if (car1.x < 0) {
                r = carGuardrailCollide(car1, guardrails[0])
            }
            else {
                r = carGuardrailCollide(car1, guardrails[1])
            }
            if (r["h"] < 1) { // If there is collision between car1 and a guardrail
                var ep = 0.001;
		        car1.x = car1.px + r.h*(car1.x-car1.px) + ep*r.nx;
		        car1.y = car1.py + r.h*(car1.y-car1.py) + ep*r.ny;
		        car1.z = car1.pz + r.h*(car1.z-car1.pz) + ep*r.nz;
                car1.bounce()
            }
            // car2-guardrail check
            if (car2.x < 0) {
                r = carGuardrailCollide(car2, guardrails[0])
            }
            else {
                r = carGuardrailCollide(car2, guardrails[1])
            }
            if (r["h"] < 1) { // If there is collision between car2 and a guardrail
                var ep = 0.001;
		        car2.x = car2.px + r.h*(car2.x-car2.px) + ep*r.nx;
		        car2.y = car2.py + r.h*(car2.y-car2.py) + ep*r.ny;
		        car2.z = car2.pz + r.h*(car2.z-car2.pz) + ep*r.nz;
                car2.bounce()
            }
            // update game state
            car1.update()
            car2.update()
            // render game
            scene.render()
        })
    })
}